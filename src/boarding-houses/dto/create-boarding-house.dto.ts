import {
  IsBoolean,
  IsJSON,
  IsNotEmpty,
  IsInt,
  IsString,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateBoardingHouseDto {
  @IsInt()
  @IsNotEmpty()
  ownerId!: number;

  @IsString()
  @IsNotEmpty()
  owner!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  // * Di ko sure ani?
  @IsNumberString()
  @IsNotEmpty()
  price!: number;

  @IsJSON()
  // @IsNotEmpty()
  @IsOptional()
  amenities?: Prisma.JsonValue;

  @IsBoolean()
  @IsNotEmpty()
  availabilityStatus!: boolean;

  @IsJSON()
  @IsNotEmpty()
  properties!: Record<string, any>;

  /*
  id                 Int                  @id @default(autoincrement())
  locationId         Int
  location           Location             @relation(fields: [locationId], references: [id])
  createdAt          DateTime             @default(now())
  updatedAt          DateTime             @updatedAt
  bookings           Booking[]
  BoardingHouseImage BoardingHouseImage[]
  */
}
