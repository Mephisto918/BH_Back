export type ResourceType =
  | 'TENANT'
  | 'OWNER'
  | 'ADMIN'
  | 'BOARDING_HOUSE'
  | 'ROOM';
export type MediaType =
  | 'PFP'
  | 'THUMBNAIL'
  | 'MAIN'
  | 'GALLERY'
  | 'BANNER'
  | 'FLOORPLAN'
  | 'DOCUMENT'
  | 'QR'
  | 'MAP'
  | 'ROOM';

export type PrismaModel =
  | 'tenant'
  | 'owner'
  | 'admin'
  | 'boardingHouse'
  | 'room';

export type ImageQuality = 'LOW' | 'MEDIUM' | 'HIGH';
