import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';

import { FileFormat, PermitType } from '@prisma/client';
import { Transform } from 'class-transformer';

export class UpdatePermitDto {
  @IsOptional()
  @IsEnum(FileFormat)
  fileFormat?: FileFormat;

  @IsOptional()
  @IsEnum(PermitType)
  @Transform(({ value }) => (value as string).replace(/"/g, '') as PermitType)
  type?: PermitType;

  @IsOptional()
  @IsString()
  url?: string; // new file path

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
