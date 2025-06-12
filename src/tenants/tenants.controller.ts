import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  findAll() {
    const results = this.tenantsService.findAll();
    return results
  }

  @Post()
  @ApiOperation({ summary: 'Create a new resource' })
  @ApiBody({
    schema: {
      example: {
        username: 'user123',
        firstname: 'John',
        lastname: 'Doe',
        email: 'ezVw2@example.com',
        password: 'password123',
        age: 30,
        guardian: 'Jane Doe',
        address: '123 Main St',
        phone_number: '123-456-7890',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The resource has been successfully created.',
  })
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(createTenantDto);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.tenantsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
  //   return this.tenantsService.update(+id, updateTenantDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const castedId = Number(id);
    return this.tenantsService.remove(castedId);
  }
}
