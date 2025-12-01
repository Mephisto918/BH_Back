import { PartialType } from '@nestjs/swagger';
import { CreateOwnerDto } from './create-owner.dto';
import { IsBoolean, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOwnerDto extends PartialType(CreateOwnerDto) {
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  hasAcceptedLegitimacyConsent?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  consentAcceptedAt?: Date;
}
