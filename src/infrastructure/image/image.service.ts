import { Injectable } from '@nestjs/common';
import path from 'path';
import fs from 'fs';
import { ResourceType, MediaType } from './types/resources-types';

/**
 ** This Service only concers on read and writing on disk *
 */

@Injectable()
export class ImageService {
  async processUpload(
    file: Express.Multer.File,
    resourceType: ResourceType,
    resourceId: number,
    mediaType: MediaType,
  ): Promise<{ path: string }> {
    // TODO: make a domain-specific exception later (e.g., InvalidImageMetadataException) for better error handling.
    if (!resourceType || !resourceId || !mediaType) {
      const missingFields = [
        !resourceType ? 'resourceType' : null,
        !resourceId && resourceId !== 0 ? 'resourceId' : null,
        !mediaType ? 'mediaType' : null,
      ].filter(Boolean);

      throw new Error(`Missing metadata field(s): ${missingFields.join(', ')}`);
    }

    const resourceDirectoryPath = this.computeDestinationFor(
      resourceType,
      resourceId,
      mediaType,
      file,
    );

    await fs.promises.mkdir(path.dirname(resourceDirectoryPath), {
      recursive: true,
    });
    await fs.promises.writeFile(resourceDirectoryPath, file.buffer);

    return { path: resourceDirectoryPath };
  }

  async processUploads(
    files: Express.Multer.File[],
    resourceType: ResourceType,
    resourceId: number,
    mediaType: MediaType,
  ): Promise<{ path: string }> {
    if (!resourceType || !resourceId || !mediaType) {
      const missingFields = [
        !resourceType ? 'resourceType' : null,
        !resourceId && resourceId !== 0 ? 'resourceId' : null,
        !mediaType ? 'mediaType' : null,
      ].filter(Boolean);

      throw new Error(`Missing metadata field(s): ${missingFields.join(', ')}`);
    }

    const fileWrites = files.map((file) => ({
      path: this.computeDestinationFor(
        resourceType,
        resourceId,
        mediaType,
        file,
      ),
      buffer: file.buffer,
    }));

    await Promise.all(
      fileWrites.map(async (file) => {
        await fs.promises.mkdir(path.dirname(file.path), { recursive: true });
        await fs.promises.writeFile(file.path, file.buffer);
      }),
    );

    const resourceDrictoryPath = path.join(
      resourceType,
      String(resourceId),
      mediaType,
    );

    return { path: resourceDrictoryPath };
  }

  private computeDestinationFor(
    resourceType: ResourceType,
    resourceId: number,
    mediaType: MediaType,
    file: Express.Multer.File,
  ): string {
    // You can choose dynamic folders here based on resource id, date, type, etc.
    const filename = this.generateFilename(file);
    const fullResourcePath = path.join(
      resourceType,
      String(resourceId),
      mediaType,
      filename,
    );
    return path.join(process.cwd(), 'media', fullResourcePath);
  }

  generateFilename(file: Express.Multer.File): string {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    return `${uniqueSuffix}-${file.originalname}`;
  }

  // resourceType/resourceId/mediaType/filename
  async processGet(path: string): Promise<Buffer> {
    const data = await fs.promises.readFile(path);
    return data;
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
