import { PartialType, PickType } from '@nestjs/swagger';
import { CreateBoardingHouseDto } from './create-boarding-house.dto';

export class UpdateBoardingHouseDto extends PartialType(
  PickType(CreateBoardingHouseDto, [
    'name',
    'address',
    'description',
    'price',
    'availabilityStatus',
    'amenities',
    'properties',
  ]),
) {}
