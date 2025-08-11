import {
  IsInt,
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
} from 'class-validator';

import { FileFormat, PermitType } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreatePermitDto {
  @IsInt()
  ownerId!: number;

  @IsEnum(FileFormat)
  @IsOptional()
  fileFormat?: FileFormat;

  @IsEnum(PermitType)
  @Transform(({ value }) => (value as string).replace(/"/g, '') as PermitType)
  type!: PermitType;

  @IsOptional()
  @IsString()
  url?: string;

  @IsDateString()
  expiresAt!: string;
}
