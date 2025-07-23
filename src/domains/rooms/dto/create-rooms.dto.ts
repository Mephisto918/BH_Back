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
import { RoomTypeEnum } from '../types/rooms.type';

export class CreateRoomsDto {
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  boardingHouseId?: number;

  @IsString()
  @IsNotEmpty()
  roomNumber!: string;

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

  @IsOptional()
  @IsEnum(RoomTypeEnum)
  @Type(() => String)
  roomType?: RoomTypeEnum;

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
