import { IsString, IsNumber, IsOptional, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';

export class LocationDto {
  // * Location Fields
  @IsDefined()
  @IsNumber()
  @Type(() => Number)
  latitude!: number;

  @IsDefined()
  @IsNumber()
  @Type(() => Number)
  longitude!: number;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  province?: string;

  @IsString()
  @IsOptional()
  country?: string;
}
