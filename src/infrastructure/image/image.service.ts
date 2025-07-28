import path from 'path';
import fs from 'fs';
// import fsPromises from 'fs/promises';
import { Inject, Injectable } from '@nestjs/common';
import { ResourceType, MediaType, PrismaModel } from './types/resources-types';
import { ConfigService } from 'src/config/config.service';
import { IDatabaseService } from '../database/database.interface';
import { ImageQuality, Prisma, PrismaClient } from '@prisma/client';
import { Findable } from './types/type.guards';
import { ImagePathUtil } from './image.path-builder';

/**
 ** This Service only concers on read and writing on disk *
 ** Reading on disks concerns on resolving image(s) path using global route for an images
 ** Reading on disks concerns on resolving image(s) path using private route resources for an image
 */

@Injectable()
export class ImageService {
  constructor(
    @Inject('IDatabaseService') private readonly database: IDatabaseService,
    private readonly configService: ConfigService,
    private readonly imagePathUtil: ImagePathUtil,
  ) {}

  get mediaPaths() {
    return this.configService.mediaPaths;
  }

  get prisma() {
    return this.database.getClient();
  }

  async processUploadInTransaction(
    tx: Prisma.TransactionClient,
    files: Express.Multer.File[],
    resourceType: ResourceType,
    resourceId: number,
    mediaType: MediaType,
    quality: ImageQuality = 'MEDIUM',
    isPublic = true,
    options?: { childType?: ResourceType; childId?: number }, //* possible raname
  ): Promise<{ imageIds: number[] }> {
    try {
      if (
        options?.childType &&
        !Object.values(ResourceType).includes(options.childType)
      ) {
        throw new Error(`Invalid childType: ${options.childType}`);
      }
      if (!files?.length) return { imageIds: [] };

      const castedOptions = options?.childType
        ? {
            ...options,
            childType: options.childType, // 👈 cast string to ResourceType
          }
        : options;

      const validMediaTypes = [
        MediaType.THUMBNAIL,
        MediaType.MAIN,
        MediaType.GALLERY,
        MediaType.PFP,
        MediaType.ROOM,
      ];
      if (!validMediaTypes.includes(mediaType)) {
        throw new Error(`Invalid mediaType: ${mediaType}`);
      }

      const SINGLE_INSTANCE_TYPES = [
        MediaType.THUMBNAIL,
        MediaType.MAIN,
        MediaType.PFP,
      ];
      if (SINGLE_INSTANCE_TYPES.includes(mediaType)) {
        await tx.image.deleteMany({
          where: {
            entityType: resourceType,
            entityId: resourceId,
            type: mediaType,
          },
        });
      }

      const imageIds: number[] = [];

      for (const file of files) {
        const absPath = this.imagePathUtil.buildAbsolutePath(
          resourceType,
          resourceId,
          mediaType,
          file.originalname,
          isPublic,
          castedOptions,
        );

        const relPath = this.imagePathUtil.buildRelativePath(
          resourceType,
          resourceId,
          mediaType,
          file.originalname,
          castedOptions,
        );

        // await this.imagePathUtil.ensureDirectoryExists(absPath);
        await this.imagePathUtil.ensureDirectoryExists(path.dirname(absPath));
        await fs.promises.writeFile(absPath, file.buffer);

        const image = await tx.image.create({
          data: {
            url: relPath,
            type: mediaType,
            quality,
            entityType: resourceType,
            entityId: resourceId,
          },
        });

        imageIds.push(image.id);
      }

      return { imageIds };
    } catch (err) {
      console.error('Failed to write file:', err);
      throw new Error('File system write failed');
    }
  }
  async getMediaPath(
    fileUrl: string,
    isPublic: boolean,
  ): Promise<string | null> {
    const fullPath = this.imagePathUtil.getAbsolutePath(fileUrl, isPublic);

    try {
      await fs.promises.access(fullPath, fs.constants.F_OK);
      const baseUrl = this.configService.DOMAIN_URL.replace(/\/+$/, '');
      const folder = isPublic
        ? this.mediaPaths.public
        : this.mediaPaths.protected;

      return `${baseUrl}/${folder}/${fileUrl}`.replace(/\\/g, '/');
    } catch {
      return null;
    }
  }

  private computeDestinationFor(
    resourceType: ResourceType,
    resourceId: number,
    mediaType: MediaType,
    file: Express.Multer.File,
    isPublic: boolean,
  ): string {
    // Convert enum to string for path building
    return path.join(
      process.cwd(),
      isPublic ? 'media/public' : 'media/protected',
      resourceType.toString(),
      resourceId.toString(),
      mediaType.toString(),
      `${Date.now()}-${file.originalname}`,
    );
  }

  private buildPathFromEntity({
    entityType,
    entityId,
    parentEntityType,
    parentEntityId,
    mediaType,
  }: {
    entityType: ResourceType;
    entityId: number;
    parentEntityType?: ResourceType;
    parentEntityId?: number;
    mediaType: MediaType;
  }) {
    const segments: string[] = [];

    if (parentEntityType && parentEntityId) {
      segments.push(parentEntityType);
      segments.push(String(parentEntityId));
    }

    segments.push(entityType);
    segments.push(String(entityId));
    segments.push(mediaType);

    return path.join(...segments);
  }

  private async validateEntity(resourceType: ResourceType, resourceId: number) {
    const entityMap: Record<ResourceType, PrismaModel> = {
      TENANT: PrismaModel.TENANT,
      OWNER: PrismaModel.OWNER,
      ADMIN: PrismaModel.ADMIN,
      BOARDING_HOUSE: PrismaModel.BOARDING_HOUSE,
      ROOM: PrismaModel.ROOM,
    };
    const entityKey = entityMap[resourceType];
    const model = this.prisma[entityKey as keyof PrismaClient] as unknown;

    if (!this.hasFindUnique(model)) {
      throw new Error(
        `Model not found or doesn't support findUnique: ${entityKey}`,
      );
    }

    const typedModel = model; // ✅ Safe because of type guard

    const result = await typedModel.findUnique({
      where: { id: resourceId },
      select: { id: true },
    });

    if (!result) {
      throw new Error(`Entity ${entityKey} with ID ${resourceId} not found`);
    }
  }

  generateFilename(file: Express.Multer.File): string {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    return `${uniqueSuffix}-${file.originalname}`;
  }

  private hasFindUnique(model: unknown): model is Findable {
    return (
      typeof model === 'object' &&
      model !== null &&
      typeof (model as Record<string, unknown>)?.findUnique === 'function'
    );
  }
}

// * Implementation on other layers *
// @Post('upload')
// @UseInterceptors(FileInterceptor('file', multerUploadConfig))
// upload(@UploadedFile() file: Express.Multer.File) {
//   return this.imageService.processUpload(file);
// }

// private tenantProfileImage(resourceId: number, filename: string): string {
//   return path.join(
//     'media',
//     'tenant',
//     `${tenantId}`,
//     'profile-image',
//     filename,
//   );
// }
