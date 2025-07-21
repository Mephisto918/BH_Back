import { ApiProperty } from '@nestjs/swagger';
import { ResourceType, MediaType } from '../types/resources-types';

export class MediaUploadDto {
  @ApiProperty({
    enum: ['tenants', 'owners', 'admins', 'boardingHouses', 'rooms'],
  })
  resourceType!: ResourceType;

  @ApiProperty({ type: Number })
  resourceId!: number;

  @ApiProperty({ enum: ['THUMBNAIL', 'MAIN', 'GALLERY', 'PFP', 'ROOM'] })
  mediaType!: MediaType;

  @ApiProperty({ type: 'string', format: 'binary' })
  file!: Express.Multer.File;

  @ApiProperty({ enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' }) // I recommend adding quality
  quality?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export class MediaUploadsDto {
  @ApiProperty({
    enum: ['tenants', 'owners', 'admins', 'boardingHouses', 'rooms'],
  })
  resourceType!: ResourceType;

  @ApiProperty({ type: Number })
  resourceId!: number;

  @ApiProperty({ enum: ['THUMBNAIL', 'MAIN', 'GALLERY', 'PFP', 'ROOM'] })
  mediaType!: MediaType;

  @ApiProperty({ type: 'string', format: 'binary', isArray: true })
  files!: Express.Multer.File[];

  @ApiProperty({ enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' }) // I recommend adding quality
  quality?: 'LOW' | 'MEDIUM' | 'HIGH';
}
