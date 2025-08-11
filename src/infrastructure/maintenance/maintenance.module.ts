import { Module } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { CleanupService } from './cleanup.service';
import { PrismaService } from '../database/prisma.service';
import { FileOpsUtils } from '../shared/utils/file-ops.utls';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [MaintenanceService, CleanupService, PrismaService, FileOpsUtils],
})
export class MaintenanceModule {}
