import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { MediaPathBuilderUtil } from './media-path-builder.util';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class FileOpsUtils {
  constructor(
    private readonly mediaPathBuilderUtil: MediaPathBuilderUtil,
    private readonly configService: ConfigService,
  ) {}

  get mediaPaths() {
    return this.configService.mediaPaths;
  }

  generateFilename(file: Express.Multer.File): string {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    return `${uniqueSuffix}-${file.originalname}`;
  }

  async deleteFileStrict(filePath: string): Promise<void> {
    await fs.promises.unlink(filePath); // no try-catch
  }

  async diskWrite(absPath: string, file: Express.Multer.File): Promise<void> {
    try {
      await this.mediaPathBuilderUtil.ensureDirectoryExists(
        path.dirname(absPath),
      );
      await fs.promises.writeFile(absPath, file.buffer);
    } catch (err: any) {
      // You could log or rethrow with more context
      throw new Error(`Failed to write file at ${absPath}: ${err}`);
    }
  }

  async safeDeleteFile(fileUrl: string, isPublic: boolean): Promise<void> {
    const filePath = this.mediaPathBuilderUtil.getAbsolutePath(
      fileUrl,
      isPublic,
    );
    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      console.warn('File deletion failed (may not exist):', filePath, err);
    }
  }

  async getMediaPath(
    fileUrl: string,
    isPublic: boolean,
  ): Promise<string | null> {
    const fullPath = this.mediaPathBuilderUtil.getAbsolutePath(
      fileUrl,
      isPublic,
    );
    console.warn('fullPath', fullPath);

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

  //* needs review
  async updateFile(
    oldFileUrl: string,
    newFile: Express.Multer.File,
    isPublic: boolean,
  ): Promise<void> {
    const oldFilePath = this.mediaPathBuilderUtil.getAbsolutePath(
      oldFileUrl,
      isPublic,
    );

    // Delete old file if it exists
    try {
      await fs.promises.unlink(oldFilePath);
    } catch (err: any) {
      console.warn(`Old file not deleted (may not exist): ${oldFilePath}`, err);
    }

    // Build new path from the new file's name and context
    const newFilePath = this.mediaPathBuilderUtil.getAbsolutePath(
      newFile.originalname, // Or however your app gets the path
      isPublic,
    );

    // Write the new file
    try {
      await this.mediaPathBuilderUtil.ensureDirectoryExists(
        path.dirname(newFilePath),
      );
      await fs.promises.writeFile(newFilePath, newFile.buffer);
    } catch (err: any) {
      throw new Error(`Failed to write updated file at ${newFilePath}: ${err}`);
    }
  }
}
