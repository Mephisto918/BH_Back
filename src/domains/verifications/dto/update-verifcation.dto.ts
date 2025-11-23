import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';

import { FileFormat, VerificationType } from '@prisma/client';
import { Transform } from 'class-transformer';

export class UpdateVerifcationDto {
  @IsOptional()
  @IsEnum(FileFormat)
  fileFormat?: FileFormat;

  @IsOptional()
  @IsEnum(VerificationType)
  @Transform(
    ({ value }) => (value as string).replace(/"/g, '') as VerificationType,
  )
  type?: VerificationType;

  @IsOptional()
  @IsString()
  url?: string; // new file path

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
