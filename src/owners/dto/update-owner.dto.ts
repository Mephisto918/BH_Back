import { PartialType, PickType } from '@nestjs/swagger';
import { CreateOwnerDto } from './create-owner.dto';

export class UpdateOwnerDto extends PartialType(
  PickType(CreateOwnerDto, [
    'username',
    'firstname',
    'lastname',
    'email',
    'age',
    'address',
    'phone_number',
  ]),
) {}
