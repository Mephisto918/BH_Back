import { Inject, Injectable } from '@nestjs/common';
import { IDatabaseService } from 'src/database/database.interface';
import { PrismaService } from 'src/database/prisma.service';

import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(
    @Inject('IDatabaseService') private readonly database: IDatabaseService,
  ) {}
  private get prisma() {
    return this.database.getClient() as PrismaService;
  }

  findAll() {
    const prisma = this.prisma;
    return prisma.tenant.findMany();
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

  // findOne(id: number) {
  //   return `This action returns a #${id} tenant`;
  // }

  // update(id: number, updateTenantDto: UpdateTenantDto) {
  //   return `This action updates a #${id} tenant`;
  // }

  remove(id: number) {
    return this.prisma.tenant.delete({
      where: {
        id,
      },
    });
  }
}
