import { IsInt, IsOptional, IsEnum, IsDateString } from 'class-validator';

import { FileFormat, VerificationType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';

export class CreateVerifcationDto {
  @Type(() => Number)
  @IsInt()
  userId!: number;

  @IsEnum(FileFormat)
  @IsOptional()
  fileFormat?: FileFormat;

  @IsEnum(VerificationType)
  @Transform(
    ({ value }) => (value as string).replace(/"/g, '') as VerificationType,
  )
  type!: VerificationType;

  @IsDateString()
  expiresAt!: string;
}
