import { Injectable } from '@nestjs/common';
import { Image, VerificationDocument } from '@prisma/client';
import { DBClient } from '../image/types/types';
import { FileOpsUtils } from '../shared/utils/file-ops.utls';
import { UploadMeta } from './types/payloads';

@Injectable()
export abstract class BaseFileUploadService {
  constructor(protected readonly fileOpsUtils: FileOpsUtils) {}

  /**
   * Override this in subclasses to validate file type and allowed media types.
   */
  protected abstract validateMeta(meta: UploadMeta): Promise<void> | void;

  /**
   * Override this to persist the uploaded file to the correct Prisma model.
   */
  protected abstract persistToDatabase(
    prisma: DBClient,
    relPath: string,
    meta: UploadMeta,
    payload: Partial<Image> | Partial<VerificationDocument>, //TODO needs further abstraction
  ): Promise<{ id: number }>;

  protected async uploadFile(
    prisma: DBClient,
    meta: UploadMeta,
    file: Express.Multer.File,
    payload: Partial<Image> | Partial<VerificationDocument>, //TODO needs further abstraction
    paths: { relPath: string; absPath: string },
  ): Promise<number> {
    await this.validateMeta(meta);

    if (!file) throw new Error('File is missing');

    // 1. Persist DB record first, but don’t finalize anything outside transaction yet
    const { id } = await this.persistToDatabase(
      prisma,
      paths.relPath,
      meta,
      payload,
    );

    try {
      // 2. Write the file to disk
      await this.fileOpsUtils.diskWrite(paths.absPath, file);
    } catch (error: any) {
      // 3. If disk write fails, rollback DB entry by throwing error to rollback transaction
      //    or explicitly delete the DB record if you’re outside a transaction
      throw new Error(`Disk write failed after DB insert, aborting: ${error}`);
    }
    return id;
  }
}
