import path from 'path';
import fs from 'fs';
// import fsPromises from 'fs/promises';
import { Inject, Injectable } from '@nestjs/common';
import { ResourceType, MediaType, PrismaModel } from './types/resources-types';
import { ConfigService } from 'src/config/config.service';
import { IDatabaseService } from '../database/database.interface';
import { ImageQuality, Prisma, PrismaClient } from '@prisma/client';
import { Findable } from './types/type.guards';

/**
 ** This Service only concers on read and writing on disk *
 ** Reading on disks concerns on resolving image(s) path using global route for an images
 ** Reading on disks concerns on resolving image(s) path using private route resources for an image
 */

@Injectable()
export class ImageService {
  constructor(
    @Inject('IDatabaseService') private readonly database: IDatabaseService,
    private readonly condfigService: ConfigService,
  ) {}

  get mediaPaths() {
    return this.condfigService.mediaPaths;
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
  ): Promise<{ imageIds: number[] }> {
    if (!files?.length) return { imageIds: [] };

    const validImageTypes: MediaType[] = [
      'THUMBNAIL',
      'MAIN',
      'GALLERY',
      'PFP',
      'ROOM',
    ];
    if (!validImageTypes.includes(mediaType)) {
      throw new Error(`Invalid mediaType: ${mediaType}`);
    }

    // Ensure one instance of certain types
    const SINGLE_INSTANCE_TYPES: MediaType[] = ['THUMBNAIL', 'MAIN', 'PFP'];
    if (SINGLE_INSTANCE_TYPES.includes(mediaType)) {
      await tx.image.deleteMany({
        where: {
          entityType: resourceType,
          entityId: resourceId,
          type: mediaType,
        },
      });
    }

    const fileWrites = files.map((file) => {
      const absPath = this.computeDestinationFor(
        resourceType,
        resourceId,
        mediaType,
        file,
        isPublic,
      );
      return {
        absPath,
        relPath: path.join(
          resourceType,
          String(resourceId),
          mediaType,
          path.basename(absPath),
        ),
        buffer: file.buffer,
      };
    });

    const imageIds: number[] = [];

    for (const { absPath, relPath, buffer } of fileWrites) {
      await fs.promises.mkdir(path.dirname(absPath), { recursive: true });
      await fs.promises.writeFile(absPath, buffer);

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

    return {
      imageIds,
    };
  }

  // resourceType/resourceId/mediaType/filename
  getMedilaPath(filePath: string, isPublic: boolean): string {
    const mediaPath = isPublic
      ? this.condfigService.mediaPaths.public
      : this.mediaPaths.protected;
    return this.condfigService.DOMAIN_URL + mediaPath + '/' + filePath;
  }

  private computeDestinationFor(
    resourceType: ResourceType,
    resourceId: number,
    mediaType: MediaType,
    file: Express.Multer.File,
    isPublic: boolean,
  ): string {
    // You can choose dynamic folders here based on resource id, date, type, etc.
    const filename = this.generateFilename(file);
    const fullResourcePath = path.join(
      resourceType,
      String(resourceId),
      mediaType,
      filename,
    );
    return path.join(
      process.cwd(),
      isPublic ? this.mediaPaths.public : this.mediaPaths.protected,
      fullResourcePath,
    );
  }

  private async validateEntity(resourceType: ResourceType, resourceId: number) {
    const entityMap: Record<ResourceType, PrismaModel> = {
      TENANT: 'tenant',
      OWNER: 'owner',
      ADMIN: 'admin',
      BOARDING_HOUSE: 'boardingHouse',
      ROOM: 'room',
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
