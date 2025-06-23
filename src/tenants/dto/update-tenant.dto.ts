import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateTenantDto } from './create-tenant.dto';

export class UpdateTenantDto extends PartialType(
  PickType(CreateTenantDto, [
    'username',
    'firstname',
    'lastname',
    'email',
    'password',
    'age',
    'guardian',
    'address',
    'phone_number',
  ]),
) {}
