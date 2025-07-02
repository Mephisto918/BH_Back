import { PartialType, PickType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';

export class UpdateAdminDto extends PartialType(
  PickType(CreateAdminDto, [
    'username',
    'firstname',
    'lastname',
    'email',
    'password',
    'age',
    'address',
    'phone_number',
  ]),
) {}
