import { Express } from 'express';

// export type FileMap = Record<string, Express.Multer.File[]>;
export interface FileMap {
  thumbnail?: Express.Multer.File[];
  gallery?: Express.Multer.File[];
  main?: Express.Multer.File[];
  roomGallery?: Record<string, Express.Multer.File[]>; // e.g., { roomGallery0_0: [...], roomGallery0_1: [...] }
}
