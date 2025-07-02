import { ImageService } from './image.service';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn(),
    writeFile: jest.fn(),
    readFile: jest.fn(),
  },
}));

describe('ImageService', () => {
  let service: ImageService;

  beforeEach(() => {
    service = new ImageService();
  });

  it('should generate a file name format', () => {
    const mockFile = { originalname: 'sample.jpg' } as Express.Multer.File;
    const filename = service.generateFilename(mockFile);

    expect(filename).toMatch(/^\d+-\d+-sample\.jpg$/);
  });

  it('should throw if metadata is missing', async () => {
    const mockFile = {
      originalname: 'photo.jpg',
      buffer: Buffer.from(''),
    } as Express.Multer.File;
    await expect(
      service.processUpload(mockFile, 'tenants', NaN, 'images'),
    ).rejects.toThrow('MetaData is missing!');
  });

  it('should build correct path and call fs functions', async () => {
    const mockFile = {
      fieldname: 'file',
      originalname: 'sample2.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1024,
      destination: '/tmp/uploads',
      filename: 'sample2.jpg',
      path: '/tmp/uploads/sample2.jpg',
      buffer: Buffer.from('test-data'),
    } as Express.Multer.File;

    const resourceType = 'tenants';
    const resourceId = 123;
    const mediaType = 'images';

    const result = await service.processUpload(
      mockFile,
      resourceType,
      resourceId,
      mediaType,
    );

    expect(result.path).toContain(
      path.join('uploads', resourceType, String(resourceId), mediaType),
    );
    expect(fs.promises.mkdir).toHaveBeenCalled();
    expect(fs.promises.writeFile).toHaveBeenCalled();
  });

  it('should return an image', async () => {
    const path = 'tenants/1/thumbnail/armageddon.jpg';

    // Mock readFile to return a Buffer
    (fs.promises.readFile as jest.Mock).mockResolvedValue(
      Buffer.from('fake image data'),
    );

    await expect(service.processGet(path)).resolves.toBeInstanceOf(Buffer);

    expect(fs.promises.readFile).toHaveBeenCalledWith(path);
  });
});
