import { CreateRoomsDto } from '../dto/create-rooms.dto';

export interface CreateRoomsWithGallery extends CreateRoomsDto {
  gallery?: Express.Multer.File[];
  thumbnail?: Express.Multer.File[];
}
