import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FileOpsUtils } from '../shared/utils/file-ops.utls';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(
    private prisma: PrismaService,
    private fileService: FileOpsUtils,
  ) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  async handleFileCleanup() {
    this.logger.log('Running cleanup job...');

    const oldFiles = await this.prisma.image.findMany({
      where: {
        isDeleted: true,
        deletedAt: {
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // older than 7 days
        },
      },
    });

    for (const file of oldFiles) {
      // await this.fileService.safeDeleteFile(file.url); // 👈 your existing unlink util
      await this.prisma.image.delete({ where: { id: file.id } });
    }

    this.logger.log(`Cleaned ${oldFiles.length} files.`);
  }
}
