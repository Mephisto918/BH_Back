import { Injectable } from '@nestjs/common';
import { DocumentService } from '../document/document.service';
import { DBClient } from '../image/types/types';
import {
  MediaPathBuilderUtil,
  ResourceTarget,
} from '../shared/utils/media-path-builder.util';
import { FileOpsUtils } from '../shared/utils/file-ops.utls';
import { CreatePermitDto } from './dto/create-permit.dto';
import { PermitMetaData } from './types/permit.types';

@Injectable()
export class PermitService {
  constructor(
    private readonly documentService: DocumentService,
    private readonly mediaPathBuilderUtil: MediaPathBuilderUtil,
    private readonly fileOpsUtils: FileOpsUtils,
  ) {}

  async create(
    prisma: DBClient,
    file: Express.Multer.File,
    target: ResourceTarget,
    payload: CreatePermitDto,
    isPublic?: boolean,
  ): Promise<number> {
    const { relPath, absPath } = this.mediaPathBuilderUtil.buildStoragePath(
      isPublic ?? true,
      target,
    );
    const filename = this.fileOpsUtils.generateFilename(file);

    const fullRelPath = `${relPath}/${filename}`;
    const fullAbsPath = `${absPath}/${filename}`;

    // Start DB insert first inside the current transaction
    const record = await prisma.permit.create({
      data: {
        ownerId: +payload.ownerId,
        url: fullRelPath,
        type: payload.type,
        fileFormat: payload.fileFormat,
        expiresAt: payload.expiresAt,
      },
    });

    try {
      // Now attempt file write
      await this.documentService.writeFileToDisk(file, {
        relPath: fullRelPath,
        absPath: fullAbsPath,
      });
    } catch (error) {
      // File write failed - delete the DB record manually to avoid orphan
      await prisma.permit.delete({ where: { id: record.id } });

      // Re-throw the error so transaction fails as well
      throw error;
    }

    return record.id;
  }

  async getPermitMetaData(
    prisma: DBClient,
    id: number,
    IsBoolean: boolean,
    // getMediaPath: (url: string, isPublic: boolean) => Promise<string | null>,
  ): Promise<{ permit: PermitMetaData }> {
    const permit = await prisma.permit.findUnique({ where: { id } });

    if (!permit) {
      throw new Error(`Permit with id ${id} not found`);
    }

    const transformedUrl = await this.fileOpsUtils.getMediaPath(
      permit.url,
      IsBoolean,
    );
    if (!transformedUrl) {
      console.warn('Skipping pdf due to null transformedUrl:', permit.url);
      console.warn('transformedUrl value:', transformedUrl);
      throw new Error('Skipping pdf due to null transformedUrl');
    }

    // Map date fields to ISO strings, handle nullable dates properly
    const mappedPermit: PermitMetaData = {
      ...permit,
      url: transformedUrl,
      expiresAt: permit.expiresAt.toISOString(),
      verifiedAt: permit.verifiedAt ? permit.verifiedAt.toISOString() : null,
      approvedAt: permit.approvedAt ? permit.approvedAt.toISOString() : null,
      deletedAt: permit.deletedAt ? permit.deletedAt.toISOString() : null,
      createdAt: permit.createdAt.toISOString(),
      updatedAt: permit.updatedAt.toISOString(),
      // verifiedById is nullable in model, so might want to make it optional or nullable in interface
    };

    return { permit: mappedPermit };
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

  //TODO update Permits
}
