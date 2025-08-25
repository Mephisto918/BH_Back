import { Readable } from 'stream';

export class StreamableFile {
  private buffer: Buffer | null = null;
  private stream: Readable | null = null;

  constructor(file: Buffer | Uint8Array | Readable) {
    if (file instanceof Buffer || file instanceof Uint8Array) {
      this.buffer = Buffer.from(file);
    } else if (file instanceof Readable) {
      this.stream = file;
    } else {
      throw new Error('StreamableFile accepts Buffer, Uint8Array, or Readable');
    }
  }

  // NestJS calls this internally when sending the response
  getStream(): Readable {
    if (this.stream) {
      return this.stream;
    } else if (this.buffer) {
      return Readable.from(this.buffer);
    } else {
      throw new Error('No file content to stream');
    }
  }
}

//* TODO: use this later for guarding routes

//* Usage
/*
@Get(':id/pdf')
@Header('Content-Type', 'application/pdf')
@Header('Content-Disposition', 'inline; filename="document.pdf"')
async getPdf(@Param('id') id: string): Promise<StreamableFile> {
  const fileBuffer = await this.ownersService.getPdfBuffer(id);
  return new StreamableFile(fileBuffer);
}
*/
