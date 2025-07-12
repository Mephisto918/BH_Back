import {
  IsBoolean,
  IsNotEmpty,
  IsInt,
  IsString,
  IsNumberString,
  ValidateNested,
} from 'class-validator';
import { LocationDto } from 'src/infrastructure/location/dto/location.dto';
import { IsDefined } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBoardingHouseDto {
  @IsInt()
  @IsNotEmpty()
  ownerId!: number;

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

  @IsNotEmpty()
  amenities?: Array<string>;

  @IsBoolean()
  @IsNotEmpty()
  availabilityStatus!: boolean;

  @IsNotEmpty()
  properties!: Record<string, any>;
  @IsDefined()
  @ValidateNested()
  @Type(() => LocationDto)
  location!: LocationDto;
}

/*
    id                 Int                  @id @default(autoincrement())
    locationId         Int
    location           Location             @relation(fields: [locationId], references: [id])
    createdAt          DateTime             @default(now())
    updatedAt          DateTime             @updatedAt
    bookings           Booking[]
    BoardingHouseImage BoardingHouseImage[]
    */
