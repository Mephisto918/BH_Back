import { Image, Permit } from '@prisma/client';

export type ResourceMediaTypeMap = {
  IMAGE: Image;
  PDF: Permit;
};

export type ResourceMediaType = keyof ResourceMediaTypeMap;

export enum ResourceType {
  TENANT = 'TENANT',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  BOARDING_HOUSE = 'BOARDING_HOUSE',
  ROOM = 'ROOM',
}

export enum PrismaModel {
  TENANT = 'tenant',
  OWNER = 'owner',
  ADMIN = 'admin',
  BOARDING_HOUSE = 'boardingHouse',
  ROOM = 'room',
}

export enum ImageQuality {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}
