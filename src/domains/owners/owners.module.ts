import { Module } from '@nestjs/common';
import { OwnersService } from './owners.service';
import { OwnersController } from './owners.controller';
import { VerifcationModule } from 'src/domains/verifications/verification.module';
import { VerifcationService } from 'src/domains/verifications/verification.service';
import { DocumentModule } from 'src/infrastructure/document/document.module';
import { DocumentService } from 'src/infrastructure/document/document.service';
import { MediaPathBuilderUtil } from 'src/infrastructure/shared/utils/media-path-builder.util';
import { FileOpsUtils } from 'src/infrastructure/shared/utils/file-ops.utls';
import { Logger } from 'src/common/logger/logger.service';

@Module({
  imports: [VerifcationModule, DocumentModule],
  controllers: [OwnersController],
  providers: [
    OwnersService,
    VerifcationService,
    DocumentService,
    MediaPathBuilderUtil,
    FileOpsUtils,
    {
      provide: 'BASE_DIR',
      useValue: 'media', // or your base directory path
    },
    Logger,
  ],
  exports: [OwnersService],
})
export class OwnersModule {}
