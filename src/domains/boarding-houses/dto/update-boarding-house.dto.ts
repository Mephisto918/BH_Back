import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { safeParseInt, safeParseObject } from './create-boarding-house.dto';
import { LocationDto } from 'src/domains/location/dto/location.dto';

export class UpdateBoardingHouseDto {
  @IsOptional()
  @Transform(({ value }) => safeParseInt(value))
  ownerId?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  amenities?: string[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  availabilityStatus?: boolean;

  @IsOptional()
  @Transform(({ value }) => safeParseObject<LocationDto>(value))
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;
}
