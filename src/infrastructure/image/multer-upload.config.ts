import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';
import path from 'path';
import { ImageFileTypeException } from './exceptions/image-file-type.exception';

/* Constant containing a Regular Expression with the valid image upload types */
export const validImageUploadTypesRegex = /jpeg|jpg|png/;
/* Constant that sets the maximum image upload file size */
export const maxImageUploadSize = 3 * 1024 * 1024; // 3MB

export const multerUploadConfig: MulterOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: maxImageUploadSize,
  },
  fileFilter: (request, file, callback) => {
    const mimetype = validImageUploadTypesRegex.test(file.mimetype);
    const extname = validImageUploadTypesRegex.test(
      path.extname(file.originalname).toLowerCase(),
    );

    if (mimetype && extname) {
      return callback(null, true);
    }

    return callback(
      new ImageFileTypeException(validImageUploadTypesRegex),
      false,
    );
  },
};
