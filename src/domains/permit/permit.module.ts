import { Module } from '@nestjs/common';
import { PermitService } from './permit.service';
import { DocumentModule } from '../../infrastructure/document/document.module';
import { DocumentService } from '../../infrastructure/document/document.service';
import { MediaPathBuilderUtil } from '../../infrastructure/shared/utils/media-path-builder.util';
import { FileOpsUtils } from '../../infrastructure/shared/utils/file-ops.utls';
import { Logger } from 'src/common/logger/logger.service';

@Module({
  imports: [DocumentModule],
  providers: [
    PermitService,
    Logger,
    DocumentService,
    MediaPathBuilderUtil,
    FileOpsUtils,
    {
      provide: 'BASE_DIR',
      useValue: 'media', // or your base directory path
    },
  ],
})
export class PermitModule {}
