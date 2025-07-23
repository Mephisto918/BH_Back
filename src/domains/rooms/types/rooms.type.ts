import { Express } from 'express';
import { CreateRoomsDto } from '../dto/create-rooms.dto';

export enum RoomTypeEnum {
  SOLO = 'SOLO',
  DUO = 'DUO',
  TRIO = 'TRIO',
  SQUAD = 'SQUAD',
  FAMILY = 'FAMILY',
}

export interface CreateRoomsWithGallery extends CreateRoomsDto {
  gallery?: Express.Multer.File[];
}
