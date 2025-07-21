import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
  IsArray,
} from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class LocationDto {
  // * Location Fields
  // @IsDefined()
  // @IsNumber()
  // @Type(() => Number)
  // latitude!: number;

  // @IsDefined()
  // @IsNumber()
  // @Type(() => Number)
  // longitude!: number;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  coordinates!: [number, number];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  province?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  country?: string;
}
