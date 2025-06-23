import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class FindTenantsDto {
  @IsString()
  @IsOptional()
  username?: string;

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
}
