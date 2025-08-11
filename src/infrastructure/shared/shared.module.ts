import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { ConfigModule } from 'src/config/config.module';
import { MediaPathBuilderUtil } from './utils/media-path-builder.util';
import { FileOpsUtils } from './utils/file-ops.utls';

@Module({
  imports: [ConfigModule],
  providers: [
    SharedService,
    MediaPathBuilderUtil,
    {
      provide: 'BASE_DIR',
      useValue: 'media', // or your base directory path
    },
    FileOpsUtils,
  ],
  exports: [
    SharedService,
    MediaPathBuilderUtil,
    'BASE_DIR', // 👈export the BASE_DIR token so others can use it
    FileOpsUtils,
  ],
})
export class SharedModule {}
