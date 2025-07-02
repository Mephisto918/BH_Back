import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class LocationDto {
  // * Location Fields
  @IsNotEmpty()
  @IsNumber()
  latitude!: number;

  @IsNotEmpty()
  @IsNumber()
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
