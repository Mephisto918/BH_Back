import { PartialType } from '@nestjs/swagger';
import { CreateBoardingHouseDto } from './create-boarding-house.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateBoardingHouseDto extends PartialType(
  CreateBoardingHouseDto,
) {
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
