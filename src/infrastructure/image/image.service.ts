import fs from 'fs';
import { Injectable } from '@nestjs/common';
import { Image, ImageQuality, MediaType, ResourceType } from '@prisma/client';
import { BaseFileUploadService } from '../file-upload/file-upload.service';
import { UploadMeta } from '../file-upload/types/payloads';
import { DBClient, ImageMetaData } from '../image/types/types';
import { FileOpsUtils } from '../shared/utils/file-ops.utls';
import {
  MediaPathBuilderUtil,
  ResourceTarget,
} from '../shared/utils/media-path-builder.util';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class ImageService extends BaseFileUploadService {
  constructor(
    fileOpsUtils: FileOpsUtils,
    private readonly mediaPathBuilderUtil: MediaPathBuilderUtil,
    private readonly configService: ConfigService,
  ) {
    super(fileOpsUtils);
  }

  get mediaPaths() {
    return this.configService.mediaPaths;
  }

  protected validateMeta(meta: UploadMeta) {
    const validMediaTypes: ReadonlySet<MediaType> = new Set([
      MediaType.THUMBNAIL,
      MediaType.MAIN,
      MediaType.GALLERY,
      MediaType.PFP,
      MediaType.ROOM,
      MediaType.PAYMENT,
    ]);

    if (!validMediaTypes.has(meta.mediaType)) {
      throw new Error(`Invalid mediaType for image: ${meta.mediaType}`);
    }
  }

  protected async persistToDatabase(
    prisma: DBClient,
    relPath: string,
    meta: UploadMeta,
    payload: Image,
  ) {
    return prisma.image.create({
      data: {
        url: relPath,
        type: meta.mediaType,
        quality: payload.quality ?? 'MEDIUM',
        entityType: payload.entityType ?? meta.resourceType,
        entityId: payload.entityId ?? meta.resourceId,
      },
    });
  }

  async uploadImagesTransact(
    tx: DBClient,
    files: Express.Multer.File[],
    target: ResourceTarget,
    meta: UploadMeta,
    options?: {
      isPublic?: boolean;
      quality?: ImageQuality;
      entityType?: ResourceType;
      entityId?: number;
    },
  ) {
    return this.uploadImagesCore(tx, target, meta, files, options);
  }

  async uploadImages(
    prisma: DBClient,
    files: Express.Multer.File[],
    target: ResourceTarget,
    meta: UploadMeta,
    options?: {
      isPublic?: boolean;
      quality?: ImageQuality;
      entityType?: ResourceType;
      entityId?: number;
    },
  ) {
    return this.uploadImagesCore(prisma, target, meta, files, options);
  }

  private async uploadImagesCore(
    prisma: DBClient,
    target: ResourceTarget,
    meta: UploadMeta,
    files: Express.Multer.File[],
    options?: {
      isPublic?: boolean;
      quality?: ImageQuality;
      entityType?: ResourceType;
      entityId?: number;
    },
  ) {
    const fileIds: number[] = [];

    for (const file of files) {
      const filename = this.fileOpsUtils.generateFilename(file);

      const { relPath, absPath } = this.mediaPathBuilderUtil.buildStoragePath(
        options?.isPublic ?? true,
        target,
      );
      const relWFilename = `${relPath}/${filename}`;
      const absWFilename = `${absPath}/${filename}`;

      const id = await this.uploadFile(
        prisma,
        meta,
        file,
        {
          quality: options?.quality,
          entityType: options?.entityType ?? meta.resourceType,
          entityId: options?.entityId ?? meta.resourceId,
        },
        { relPath: relWFilename, absPath: absWFilename },
      );

      fileIds.push(id);
    }

    return fileIds;
  }

  /**
   * Processes a list of images and transforms them based on their media type
   * (e.g., GALLERY, THUMBNAIL), returning a metadata object containing the
   * corresponding transformed image lists.
   *
   * This method is useful for avoiding repetitive image processing logic (like in `findAll` and `findOne`),
   * allowing you to easily destructure the result:
   *
   * @example
   * const { gallery, thumbnail } = await this.getImageMetaData(
   *   images,
   *   (url, isPublic) => this.imageService.getMediaPath(url, isPublic),
   *   ResourceType.BOARDING_HOUSE,
   *   house.id,
   *   [MediaType.GALLERY, MediaType.THUMBNAIL],
   * );
   *
   * @param {Image[]} images - The array of image objects to process.
   * @param {(url: string, isPublic: boolean) => Promise<string | null>} getMediaPath -
   *        A callback that transforms the raw image URL into a usable media path.
   * @param {ResourceType} resourceType - The type of the parent resource (e.g., BOARDING_HOUSE).
   * @param {number} resourceId - The unique identifier of the parent resource.
   * @param {MediaType[]} types - An array of media types to filter and transform (e.g., THUMBNAIL, GALLERY).
   *
   * @returns {Promise<ImageMetaData>} A promise that resolves to an object containing
   *          the transformed image arrays keyed by media type (e.g., `{ gallery: [...], thumbnail: [...] }`).
   *
   * @remarks
   * - The method uses `transformImagesByType` under the hood.
   * - The return keys are conditionally set based on `MediaType` values.
   * - Extend the logic with additional `if` or `switch` cases if more media types are introduced.
   */
  async getImageMetaData(
    images: Image[],
    getMediaPath: (url: string, isPublic: boolean) => Promise<string | null>,
    resourceType: ResourceType,
    resourceId: number,
    types: MediaType[],
  ): Promise<ImageMetaData> {
    const result: ImageMetaData = {};

    for (const type of types) {
      const transformed = await this.transformImagesByType(
        images,
        type,
        getMediaPath,
        resourceType,
        resourceId,
      );

      // dynamically assign to the key based on type
      // key must match the field name like "gallery" or "thumbnail"
      if (type === MediaType.GALLERY) {
        result.gallery = transformed;
      } else if (type === MediaType.THUMBNAIL) {
        result.thumbnail = transformed;
      } else if (type === MediaType.BANNER) {
        result.thumbnail = transformed;
      } else if (type === MediaType.PFP) {
        result.thumbnail = transformed;
      }
      // else if (...) for other MediaTypes
    }

    return result;
  }
  async getMediaPath(
    fileUrl: string,
    isPublic: boolean,
  ): Promise<string | null> {
    const fullPath = this.mediaPathBuilderUtil.getAbsolutePath(
      fileUrl,
      isPublic,
    );

    try {
      await fs.promises.access(fullPath, fs.constants.F_OK);
      const baseUrl = this.configService.DOMAIN_URL.replace(/\/+$/, '');
      //* potental to be abstracted
      const folder = isPublic
        ? this.mediaPaths.public
        : this.mediaPaths.private;

      return `${baseUrl}/${folder}/${fileUrl}`.replace(/\\/g, '/');
    } catch {
      return null;
    }
  }

  private async transformImagesByType(
    images: Image[],
    type: MediaType,
    getMediaPath: (url: string, isPublic: boolean) => Promise<string | null>,
    entityType?: string,
    entityId?: number,
  ) {
    let filtered = images.filter((img) => img.type === type);

    if (entityType && entityId !== undefined) {
      filtered = filtered.filter(
        (img) => img.entityType === entityType && img.entityId === entityId,
      );
    }
    // console.log('Filtering images by type:', type);
    filtered = images.filter((img) => img.type === type);
    // console.log('Filtered images:', filtered);

    const transformed = await Promise.all(
      filtered.map(async (img) => {
        const transformedUrl = await getMediaPath(img.url, true);
        // if (!transformedUrl) return null;

        if (!transformedUrl) {
          console.warn('Skipping image due to null transformedUrl:', img.url);
          return null;
        }

        return {
          ...img,
          url: transformedUrl,
        };
      }),
    );

    return transformed.filter(
      (item): item is NonNullable<typeof item> => !!item,
    );
  }

  async deletePermit(
    tx: DBClient,
    id: number,
    filePath: string,
    isPublic: boolean,
  ) {
    const absPath = this.mediaPathBuilderUtil.getAbsolutePath(
      filePath,
      isPublic,
    );
    console.log('delete Permit absPath:', absPath);

    try {
      await this.fileOpsUtils.deleteFileStrict(absPath);
    } catch (err) {
      // Log or handle file delete error (optional)
      console.warn(`Failed to delete file at ${absPath}:`, err);
      // Decide if you want to rethrow or continue
      throw err; // or just continue if you want
    }

    await tx.permit.delete({ where: { id } });
  }
}
