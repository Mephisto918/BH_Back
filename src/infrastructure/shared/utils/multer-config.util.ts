// shared/utils/multer-config.util.ts
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';
import path from 'path';
import { BadRequestException } from '@nestjs/common';

type FileType = 'image' | 'pdf';

const mimeTypes: Record<FileType, RegExp> = {
  image: /jpeg|jpg|png/,
  pdf: /pdf/,
};

const maxSizes: Record<FileType, number> = {
  image: 3 * 1024 * 1024, // 3MB
  pdf: 5 * 1024 * 1024, // 5MB or your preferred size
};

export function createMulterConfig(
  fileType: FileType,
  // customException: new (...args: any[]) => Error,
): MulterOptions {
  const regex = mimeTypes[fileType];
  const maxSize = maxSizes[fileType];

  return {
    storage: memoryStorage(),
    limits: {
      fileSize: maxSize,
    },
    fileFilter: (req, file, cb) => {
      const isMimeValid = regex.test(file.mimetype);
      const isExtValid = regex.test(
        path.extname(file.originalname).toLowerCase(),
      );

      if (isMimeValid && isExtValid) {
        cb(null, true);
      } else {
        cb(new BadRequestException(`Invalid ${fileType} file type.`), false);
        // TODO: add custom exception
        // cb(new customException()?.(regex) ?? new BadRequestException(...), false)
      }
    },
  };
}
