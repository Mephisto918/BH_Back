import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BoardingHouseImageUploadDto } from '../../../infrastructure/image/dto/boarding-house-image.upload.dto';
import { CreateBoardingHouseDto } from './create-boarding-house.dto';

export class CreateBoardingHouseMediaDto extends CreateBoardingHouseDto {
  @ValidateNested()
  @Type(() => BoardingHouseImageUploadDto)
  images?: BoardingHouseImageUploadDto;
}
