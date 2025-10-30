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

export class UpdateRoomDto {
  @IsString()
  @IsOptional()
  roomNumber?: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  capacity?: number;

  @IsNumberString()
  @IsOptional()
  price?: number;

  @IsOptional()
  tags?: Record<string, any>;

  @IsBoolean()
  availabilityStatus?: boolean;
}
