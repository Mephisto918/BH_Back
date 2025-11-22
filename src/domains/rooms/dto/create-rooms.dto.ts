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
import { RoomFurnishingEnumSchema, RoomType } from '@prisma/client';

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

  @IsEnum(RoomType)
  roomType!: RoomType;

  @IsEnum(RoomFurnishingEnumSchema)
  furnishingType!: RoomFurnishingEnumSchema;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: Array<string>;

  @IsBoolean()
  @IsOptional()
  availabilityStatus?: boolean = true;
}
