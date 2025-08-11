import { MediaType } from '@prisma/client';
import { ResourceType } from './resources-types';

export type UploadMeta = {
  resourceType: ResourceType;
  resourceId: number;
  mediaType: MediaType;
  // resourceMediaType: ResourceMediaTypeMap;
};
