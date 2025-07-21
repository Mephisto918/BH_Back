import { AdminsService } from 'src/app/admins/admins.service';
import { TenantsService } from '../tenants/tenants.service';
import { Injectable } from '@nestjs/common';
import { OwnersService } from 'src/app/owners/owners.service';

@Injectable()
export class UserUnionService {
  constructor(
    private readonly tenantService: TenantsService,
    private readonly adminService: AdminsService,
    private readonly ownerService: OwnersService,
  ) {}

  async findUserByUsername(username: string) {
    const admin = await this.adminService.findUserByUsername(username);
    if (admin) return { type: 'admin', user: admin };

    const owner = await this.ownerService.findUserByUsername(username);
    if (owner) return { type: 'owner', user: owner };

    const tenant = await this.tenantService.findByUsername(username);
    if (tenant) return { type: 'tenant', user: tenant };

    return null;
  }
}
