import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { CreateTenantDoc, GetTenantDoc } from './tenants.swagger';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { FindTenantsDto } from './dto/find-tenants.dto';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  @GetTenantDoc()
  findAll(@Query() findAllTenantsDto: FindTenantsDto) {
    const { isDeleted, ...restQuery } = findAllTenantsDto;

    return this.tenantsService.findAll({ ...restQuery, isDeleted: false });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const results = this.tenantsService.findOne(+id);
    return results;
  }

  @Post()
  @CreateTenantDoc()
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(createTenantDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
    const result = this.tenantsService.update(+id, updateTenantDto);
    return result;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const castedId = Number(id);
    return this.tenantsService.remove(castedId);
  }
}
