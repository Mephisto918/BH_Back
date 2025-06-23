import { Inject, Injectable } from '@nestjs/common';
import { IDatabaseService } from 'src/common/database/database.interface';
import { PrismaService } from 'src/common/database/prisma.service';

import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { FindTenantsDto } from './dto/find-tenants.dto';
import { Tenant } from '@prisma/client';

@Injectable()
export class TenantsService {
  constructor(
    @Inject('IDatabaseService') private readonly database: IDatabaseService,
  ) {}
  private get prisma() {
    return this.database.getClient() as PrismaService;
  }

  findAll({
    username = '',
    page = 1,
    offset = 15,
  }: FindTenantsDto): Promise<Tenant[]> {
    const userToSkip = (page - 1) * offset;

    const prisma = this.prisma;
    return prisma.tenant.findMany({
      skip: userToSkip,
      take: offset,
      where: {
        username: {
          contains: username,
          mode: 'insensitive',
        },
      },
      orderBy: { username: 'asc' },
    });
  }

  findOne(id: number) {
    const prisma = this.prisma;
    return prisma.tenant.findUnique({
      where: {
        id: id,
      },
    });
  }

  create(dto: CreateTenantDto) {
    return this.prisma.tenant.create({
      data: {
        username: dto.username,
        firstname: dto.firstname,
        lastname: dto.lastname,
        email: dto.email,
        password: dto.password,
        age: dto.age,
        guardian: dto.guardian,
        address: dto.address,
        phone_number: dto.phone_number,
      },
    });
  }

  update(id: number, updateTenantDto: UpdateTenantDto) {
    const prisma = this.prisma;
    return prisma.tenant.update({
      where: {
        id: id,
      },
      data: {
        username: updateTenantDto.username,
        firstname: updateTenantDto.firstname,
        lastname: updateTenantDto.lastname,
        email: updateTenantDto.email,
        password: updateTenantDto.password,
        age: updateTenantDto.age,
        guardian: updateTenantDto.guardian,
        address: updateTenantDto.address,
        phone_number: updateTenantDto.phone_number,
      },
    });
  }

  remove(id: number) {
    return this.prisma.tenant.delete({
      where: {
        id,
      },
    });
  }
}
