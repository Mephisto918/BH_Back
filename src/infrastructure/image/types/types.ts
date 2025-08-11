import { Image, Prisma, PrismaClient } from '@prisma/client';
// import { ImageService } from '../image.service';

export type DBClient = PrismaClient | Prisma.TransactionClient;

export type ImageMetaData = {
  gallery?: Image[];
  thumbnail?: Image[];
  banner?: Image[];
  pfp?: Image[];
  // add more media types here if needed
};

export type PrismaDelegateMap = {
  IMAGE: Prisma.ImageDelegate;
  PDF: Prisma.PermitDelegate;
};
