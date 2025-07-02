/**
 * Used to extend another exception to make this an instanceof ImageServiceInputException
 */

export class ImageServiceInputException extends Error {
  constructor(message: string) {
    super(message);
  }
}
