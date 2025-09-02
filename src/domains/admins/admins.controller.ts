import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { FindAdminsDto } from './dto/find-admins.dto';
import { CreateAdminsDoc, GetAdminsDoc } from './admins.swagger';
import { CreateTenantDto } from '../tenants/dto/create-tenant.dto';
import { TenantsService } from '../tenants/tenants.service';
import { FindTenantsDto } from '../tenants/dto/find-tenants.dto';
import { OwnersService } from '../owners/owners.service';
import { FindOwnersDto } from '../owners/dto/find-owners.dto';
import { CreateOwnerDto } from '../owners/dto/create-owner.dto';

@Controller('admins')
export class AdminsController {
  constructor(
    private readonly adminsService: AdminsService,
    private readonly tenantsService: TenantsService,
    private readonly ownersService: OwnersService,
  ) {}

  @Get()
  @GetAdminsDoc()
  findAll(@Query() findAllAdminsDto: FindAdminsDto) {
    return this.adminsService.findAll(findAllAdminsDto);
  }

  @Post()
  @CreateAdminsDoc()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminsService.remove(+id);
  }

  @Post(':id/owners')
  createOwners(
    @Body() createOwnerDto: CreateOwnerDto,
    @Param('id') id: string,
  ) {
    return this.adminsService.createOwner(+id, createOwnerDto);
  }
  @Get('/owners')
  findAllOwners(@Query() query: FindOwnersDto) {
    return this.ownersService.findAll({ ...query });
  }
  @Delete(':adminId/owners/:ownerId')
  deleteOwner(
    @Param('adminId') adminId: string,
    @Param('ownerId') ownerId: string,
  ) {
    return this.adminsService.removeOwner(+adminId, +ownerId);
  }
  @Post(':id/tenants')
  createTenant(
    @Body() createTenantDto: CreateTenantDto,
    @Param('id') id: string,
  ) {
    return this.adminsService.createTenant(+id, createTenantDto);
  }
  @Get('/tenants')
  findAllTenants(@Query() query: FindTenantsDto) {
    return this.tenantsService.findAll({ ...query });
  }
  @Delete(':adminId/tenants/:tenantId')
  deleteTenant(
    @Param('adminId') adminId: string,
    @Param('tenantId') tenantId: string,
  ) {
    return this.adminsService.removeTenant(+adminId, +tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminsService.findOne(+id);
  }

  @Patch(':id/permits')
  updatePermit(@Param('id') id: string) {
    return this.adminsService.updatePermit(+id);
  }
}
