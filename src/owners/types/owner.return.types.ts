import { Owner } from '@prisma/client';

export interface OwnerWithBHId extends Owner {
  id: number;
  username: string;
  boardingHouses: { id: number }[];
}
