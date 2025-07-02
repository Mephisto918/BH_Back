import { MediaType, ResourceType } from '../types/resources-types';

export class MediaUploadDto {
  resourceType!: ResourceType;
  resourceId!: number;
  mediaType!: MediaType;
  file!: Express.Multer.File;
}

export class MediaUploadsDto {
  resourceType!: ResourceType;
  resourceId!: number;
  mediaType!: MediaType;
  files!: Express.Multer.File[];
}
