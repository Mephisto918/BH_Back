import { Module } from '@nestjs/common';
import { OwnersService } from './owners.service';
import { OwnersController } from './owners.controller';
import { PermitModule } from 'src/infrastructure/permit/permit.module';
import { PermitService } from 'src/infrastructure/permit/permit.service';
import { DocumentModule } from 'src/infrastructure/document/document.module';
import { DocumentService } from 'src/infrastructure/document/document.service';
import { MediaPathBuilderUtil } from 'src/infrastructure/shared/utils/media-path-builder.util';
import { FileOpsUtils } from 'src/infrastructure/shared/utils/file-ops.utls';

@Module({
  imports: [PermitModule, DocumentModule],
  controllers: [OwnersController],
  providers: [
    OwnersService,
    PermitService,
    DocumentService,
    MediaPathBuilderUtil,
    FileOpsUtils,
    {
      provide: 'BASE_DIR',
      useValue: 'media', // or your base directory path
    },
  ],
  exports: [OwnersService],
})
export class OwnersModule {}
