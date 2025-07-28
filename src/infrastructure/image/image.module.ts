import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImagePathUtil } from './image.path-builder';

@Module({
  providers: [
    ImageService,
    {
      provide: 'BASE_DIR',
      useValue: 'media', // or your base directory path
    },
    ImagePathUtil,
  ],
  exports: [ImageService, ImagePathUtil],
})
export class ImageModule {}
