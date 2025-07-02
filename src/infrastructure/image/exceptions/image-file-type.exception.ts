import { ImageServiceInputException } from './image-service.exception';

/** Used when the user inputs an invalid file type when uploading a picture
 *
 */
export class ImageFileTypeException extends ImageServiceInputException {
  constructor(fileType: RegExp) {
    super(`File upload only supports the following filetype - ${fileType}`);
  }
}
