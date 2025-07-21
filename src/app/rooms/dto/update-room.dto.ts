import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RoomTypeEnum } from '../types';

export class UpdateRoomDto {
  @IsString()
  @IsOptional()
  roomNumber?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  capacity?: number;

  @IsNumberString()
  @IsOptional()
  price?: number;

  @IsOptional()
  tags?: Record<string, any>;

  @IsOptional()
  @IsEnum(RoomTypeEnum)
  @Type(() => String)
  roomType?: RoomTypeEnum;

  @IsBoolean()
  availabilityStatus?: boolean;
}
