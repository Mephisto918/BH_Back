import {
  IsBoolean,
  IsNotEmpty,
  IsInt,
  IsString,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { LocationDto } from 'src/infrastructure/location/dto/location.dto';
import { IsDefined } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CreateRoomsDto } from '../../rooms/dto/create-rooms.dto';

export class CreateBoardingHouseDto {
  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => safeParseInt(value))
  ownerId!: number;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNotEmpty()
  amenities?: Array<string>;

  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true' || value === true)
  availabilityStatus: boolean = false;

  @Transform(({ value }) => safeParseObject<LocationDto>(value) ?? {})
  @IsDefined()
  @ValidateNested()
  @Type(() => LocationDto)
  location!: LocationDto;

  @Transform(({ value }) => safeParseObject<LocationDto>(value) ?? {})
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateRoomsDto)
  rooms?: CreateRoomsDto[];
}

// TODO: make this into a utility
/**
 * Parses a JSON string to an object of type T.
 * Returns undefined if parsing fails.
 */
export function safeParseObject<T>(value: unknown): T | undefined {
  try {
    return typeof value === 'string' ? (JSON.parse(value) as T) : (value as T);
  } catch {
    return undefined;
  }
}

export function safeParseInt(value: unknown): number | undefined {
  const n = Number(value);
  return Number.isInteger(n) ? n : undefined;
}
