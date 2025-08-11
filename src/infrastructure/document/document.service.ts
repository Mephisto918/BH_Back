import { Injectable } from '@nestjs/common';
import { BaseFileUploadService } from '../file-upload/file-upload.service';
import { FileOpsUtils } from '../shared/utils/file-ops.utls';
import { MediaPathBuilderUtil } from '../shared/utils/media-path-builder.util';
import { ConfigService } from '../../config/config.service';
import { Image, MediaType, Permit } from '@prisma/client';
import { UploadMeta } from '../file-upload/types/payloads';
import { DBClient } from '../image/types/types';

@Injectable()
export class DocumentService extends BaseFileUploadService {
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

  /** @deprecated This method is not used in DocumentService */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  protected persistToDatabase(
    prisma: DBClient,
    relPath: string,
    meta: UploadMeta,
    payload: Partial<Image> | Partial<Permit>,
  ): Promise<{ id: number }> {
    //@ts-expect-error asdas sadas
    return { id: 0 };
  }

  protected validateMeta(meta: UploadMeta) {
    const validMediaTypes: ReadonlySet<MediaType> = new Set([
      MediaType.DOCUMENT,
      MediaType.QR,
      MediaType.MAP,
    ]);

    if (!validMediaTypes.has(meta.mediaType)) {
      throw new Error(`Invalid mediaType for image: ${meta.mediaType}`);
    }
  }

  async writeFileToDisk(
    file: Express.Multer.File,
    paths: { relPath: string; absPath: string },
  ): Promise<void> {
    await this.fileOpsUtils.diskWrite(paths.absPath, file);
  }
}
