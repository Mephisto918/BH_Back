import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { SharedModule } from '../shared/shared.module';
// import { MediaPathBuilderUtil } from '../shared/utils/media-path-builder.util';
import { MediaPathBuilderUtil } from '../shared/utils/media-path-builder.util';

@Module({
  imports: [SharedModule],
  providers: [ImageService, MediaPathBuilderUtil],
  exports: [ImageService],
})
export class ImageModule {}
