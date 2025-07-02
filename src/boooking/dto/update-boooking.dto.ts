import { PartialType } from '@nestjs/swagger';
import { CreateBoookingDto } from './create-boooking.dto';

export class UpdateBoookingDto extends PartialType(CreateBoookingDto) {}
