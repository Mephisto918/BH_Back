import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoomsDto {
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  boardingHouseId?: number;

  @IsString()
  @IsNotEmpty()
  roomNumber!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  maxCapacity!: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  currentCapacity?: number = 1;

  @IsNumber()
  @IsNotEmpty()
  price!: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: Array<string>;

  @IsBoolean()
  @IsOptional()
  availabilityStatus?: boolean = true;
}

/*
id                  Int
boardingHouseId     Int
boardingHouse       BoardingHouse
roomNumber          String
capacity            Int
price               Decimal
tags                Json
roomType            RoomType
availabilityStatus  Boolean
bookings            Booking
createdAt           DateTime
updatedAt           DateTime
isDeleted           Boolean
deletedAt           DateTime
roomAvailabilityLog RoomAvailabilityLog
 */
