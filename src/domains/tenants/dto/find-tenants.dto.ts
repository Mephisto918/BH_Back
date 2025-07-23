import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  IsBoolean,
} from 'class-validator';

export class FindTenantsDto {
  @IsString()
  @IsOptional()
  username?: string;

  @Min(1)
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  page?: number;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  offset?: number;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
