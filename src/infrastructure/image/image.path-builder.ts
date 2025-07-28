import { Injectable, Inject } from '@nestjs/common';
import path from 'path';
import { promises as fs } from 'fs';
import { ConfigService } from 'src/config/config.service';
import { MediaType, ResourceType } from './types/resources-types';

@Injectable()
export class ImagePathUtil {
  constructor(
    @Inject('BASE_DIR') private readonly baseDir: string,
    private readonly configService: ConfigService,
  ) {}

  buildRelativePath(
    resourceType: ResourceType,
    resourceId: number,
    mediaType: MediaType,
    filename: string,
    options?: {
      childType?: ResourceType;
      childId?: number;
    },
  ) {
    const parts = [resourceType, String(resourceId)];

    if (options?.childType && options?.childId !== undefined) {
      parts.push(options.childType, String(options.childId));
    }

    parts.push(mediaType, filename);
    return path.join(...parts);
  }

  buildAbsolutePath(
    resourceType: ResourceType,
    resourceId: number,
    mediaType: MediaType,
    filename: string,
    isPublic: boolean,
    options?: {
      childType?: ResourceType;
      childId?: number;
    },
  ) {
    const basePath = isPublic
      ? this.configService.mediaPaths.public
      : this.configService.mediaPaths.protected;
    const relPath = this.buildRelativePath(
      resourceType,
      resourceId,
      mediaType,
      filename,
      options,
    );

    return path.join(basePath, relPath);
  }

  getAbsolutePath(fileUrl: string, isPublic: boolean): string {
    const mediaBasePath = isPublic
      ? this.configService.mediaPaths.public
      : this.configService.mediaPaths.protected;
    return path.join(process.cwd(), mediaBasePath, fileUrl);
  }

  async ensureDirectoryExists(dirPath: string): Promise<void> {
    await fs.mkdir(dirPath, { recursive: true });
  }
}
