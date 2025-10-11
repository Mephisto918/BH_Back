import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentService } from '../document/document.service';
import { DBClient } from '../image/types/types';
import {
  MediaPathBuilderUtil,
  ResourceTarget,
} from '../shared/utils/media-path-builder.util';
import { FileOpsUtils } from '../shared/utils/file-ops.utls';
import { CreatePermitDto } from './dto/create-permit.dto';
import { Logger } from 'src/common/logger/logger.service';

@Injectable()
export class PermitService {
  constructor(
    private readonly documentService: DocumentService,
    private readonly mediaPathBuilderUtil: MediaPathBuilderUtil,
    private readonly fileOpsUtils: FileOpsUtils,
    private readonly logger: Logger,
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

    //* Start DB insert first inside the current transaction
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
      //* Attempt file write
      await this.documentService.writeFileToDisk(file, {
        relPath: fullRelPath,
        absPath: fullAbsPath,
      });
    } catch (error) {
      //* File write failed - delete the DB record manually to avoid orphan
      await prisma.permit.delete({ where: { id: record.id } });

      //* Re-throw the error so transaction fails as well
      throw error;
    }

    return record.id;
  }

  //TODO update Permits
  async updatePermit(
    tx: DBClient,
    permitId: number,
    file: Express.Multer.File | undefined,
    target: ResourceTarget,
    payload: Partial<CreatePermitDto>, // reuse your DTO, make fields optional
    isPublic?: boolean,
  ) {
    const permit = await tx.permit.findUnique({ where: { id: permitId } });
    if (!permit) {
      throw new NotFoundException(`Permit ${permitId} not found`);
    }

    let updatedUrl = permit.url;

    if (file) {
      // Step 1: Build storage path for new file
      const { relPath, absPath } = this.mediaPathBuilderUtil.buildStoragePath(
        isPublic ?? true,
        target,
      );
      const filename = this.fileOpsUtils.generateFilename(file);
      const fullRelPath = `${relPath}/${filename}`;
      const fullAbsPath = `${absPath}/${filename}`;

      await this.documentService.writeFileToDisk(file, {
        relPath: fullRelPath,
        absPath: fullAbsPath,
      });

      try {
        const oldAbsPath = this.mediaPathBuilderUtil.getAbsolutePath(
          permit.url,
          isPublic ?? true,
        );
        await this.fileOpsUtils.deleteFileStrict(oldAbsPath);
      } catch (err) {
        console.warn(`Failed to delete old file for permit ${permitId}:`, err);
      }

      updatedUrl = fullRelPath;
    }

    // Step 5: Update DB record
    return tx.permit.update({
      where: { id: permitId },
      data: {
        ...payload,
        url: updatedUrl,
      },
    });
  }

  async getAllPermitMetaData(prisma: DBClient, IsPublic: boolean) {
    const permits = await prisma.permit.findMany({
      include: {
        owner: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    return Promise.all(permits.map((p) => this.formatUrl(p.url, IsPublic)));
  }

  async getPermitMetaData(prisma: DBClient, id: number, IsPublic: boolean) {
    const permit = await prisma.permit.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    if (!permit) {
      throw new NotFoundException(`Permit ${id} not found`);
    }

    let formattedUrl: string | null = null;

    try {
      formattedUrl = await this.formatUrl(permit.url, IsPublic);
    } catch (err) {
      this.logger.error(err, undefined, { permitId: id, rawUrl: permit.url });

      // ❓ Decision point:
      // 1. If missing URL is critical → throw a 500
      // throw new InternalServerErrorException(`Permit ${id} has invalid URL`);

      // 2. If you want to degrade gracefully → return null
      formattedUrl = null;
    }

    return { ...permit, url: formattedUrl };
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

  private async formatUrl(
    permitUrl: string,
    IsPublic: boolean,
  ): Promise<string | null> {
    const transformedUrl = await this.fileOpsUtils.getMediaPath(
      permitUrl,
      IsPublic,
    );

    if (!transformedUrl) {
      this.logger.warn('Skipping pdf due to null transformedUrl', {
        rawUrl: permitUrl,
      });
      return null; // 👈 no throw
    }

    return transformedUrl;
  }
}
