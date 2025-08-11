import { Injectable, Inject } from '@nestjs/common';
import path from 'path';
import { promises as fs } from 'fs';
import { ConfigService } from 'src/config/config.service';
import { MediaType } from '@prisma/client';

export type ResourceTarget =
  | {
      type: 'BOARDING_HOUSE';
      targetId: number;
      mediaType: MediaType;
    }
  | {
      type: 'BOARDING_HOUSE_ROOMS';
      targetId: number;
      childId: number;
      mediaType: MediaType;
    }
  | {
      type: 'TENANT';
      targetId: number;
      childId: number;
      mediaType: MediaType;
    }
  | {
      type: 'OWNER';
      targetId: number;
      mediaType: MediaType;
    }
  | {
      type: 'ADMIN';
      targetId: number;
      childId: number;
      mediaType: MediaType;
    };

@Injectable()
export class MediaPathBuilderUtil {
  constructor(
    @Inject('BASE_DIR') private readonly baseDir: string,
    private readonly configService: ConfigService,
  ) {}

  buildStoragePath(
    isPublic: boolean,
    resource: ResourceTarget,
  ): { absPath: string; relPath: string } {
    const relPath = (() => {
      switch (resource.type) {
        case 'BOARDING_HOUSE':
          return `BOARDING_HOUSE/${resource.targetId}/${resource.mediaType}/`;
        case 'BOARDING_HOUSE_ROOMS':
          return `BOARDING_HOUSE/${resource.targetId}/ROOMS/${resource.childId}/${resource.mediaType}/`;
        case 'TENANT':
          return `TENANT/${resource.targetId}/${resource.mediaType}/`;
        case 'OWNER':
          return `OWNER/${resource.targetId}/${resource.mediaType}/`;
        case 'ADMIN':
          return `ADMIN/${resource.targetId}/${resource.mediaType}/`;
        default:
          throw new Error(`Unknown resource type: ${(resource as any).type}`);
      }
    })();

    const basePath = isPublic
      ? this.configService.mediaPaths.public
      : this.configService.mediaPaths.private;

    const absPath = path.join(basePath, relPath);

    return { relPath, absPath };
  }

  getAbsolutePath(fileUrl: string, isPublic: boolean): string {
    const mediaBasePath = isPublic
      ? this.configService.mediaPaths.public
      : this.configService.mediaPaths.private;
    return path.join(process.cwd(), mediaBasePath, fileUrl);
  }

  async ensureDirectoryExists(dirPath: string): Promise<void> {
    await fs.mkdir(dirPath, { recursive: true });
  }
}
