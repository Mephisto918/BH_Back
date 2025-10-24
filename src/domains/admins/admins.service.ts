import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { IDatabaseService } from 'src/infrastructure/database/database.interface';
import { FindAdminsDto } from './dto/find-admins.dto';
import { Admin, PermitStatus } from '@prisma/client';
import { TenantsService } from '../tenants/tenants.service';
import { CreateTenantDto } from '../tenants/dto/create-tenant.dto';
import { OwnersService } from '../owners/owners.service';
import { CreateOwnerDto } from '../owners/dto/create-owner.dto';

/*
 *
 *
 */

@Injectable()
export class AdminsService {
  constructor(
    @Inject('IDatabaseService') private readonly database: IDatabaseService,
    private readonly tenantsService: TenantsService,
    private readonly ownersService: OwnersService,
  ) {}

  private get prisma() {
    return this.database.getClient();
  }

  findAll({
    username = '',
    page = 1,
    offset = 15,
  }: FindAdminsDto): Promise<Admin[]> {
    const userToSkip = (page - 1) * offset;

    const prisma = this.prisma;
    return prisma.admin.findMany({
      skip: userToSkip,
      take: offset,
      where: {
        username: {
          contains: username,
          mode: 'insensitive',
        },
      },
      orderBy: {
        username: 'asc',
      },
    });
  }

  findOne(id: number) {
    const prisma = this.prisma;
    return prisma.admin.findUnique({
      where: {
        id: id,
      },
    });
  }

  findUserByUsername(username: string) {
    const prisma = this.prisma;
    return prisma.admin.findUnique({
      where: {
        username: username,
      },
    });
  }

  findUserById(userId: number) {
    const prisma = this.prisma;
    return prisma.admin.findUnique({
      where: {
        id: userId,
      },
    });
  }

  create(dto: CreateAdminDto) {
    const prisma = this.prisma;

    return prisma.admin.create({
      data: {
        username: dto.username,
        firstname: dto.firstname,
        lastname: dto.lastname,
        email: dto.email,
        password: dto.password,
        age: dto.age,
        address: dto.address,
        phone_number: dto.phone_number,
      },
    });
  }

  createOwner(id: number | undefined, dto: CreateOwnerDto) {
    //TODO: Use id here for admin audit
    return this.ownersService.create(dto);
  }
  createTenant(id: number | undefined, dto: CreateTenantDto) {
    //TODO: Use id here for admin audit
    return this.tenantsService.create(dto);
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    const prisma = this.prisma;

    return prisma.admin.update({
      where: {
        id: id,
      },
      data: {
        username: updateAdminDto.username,
        firstname: updateAdminDto.firstname,
        lastname: updateAdminDto.lastname,
        email: updateAdminDto.email,
        password: updateAdminDto.password,
        age: updateAdminDto.age,
        address: updateAdminDto.address,
        phone_number: updateAdminDto.phone_number,
        isDeleted: updateAdminDto.isDeleted,
      },
    });
  }

  async removeOwner(adminId: number, ownerId: number) {
    //TODO: Use id here for admin audit
    return await this.ownersService.remove(ownerId);
  }
  async removeTenant(adminId: number, tennatId: number) {
    //TODO: Use id here for admin audit
    return await this.tenantsService.remove(tennatId);
  }

  async remove(id: number) {
    const prisma = this.prisma;
    const entity = await prisma.admin.findUnique({ where: { id } });
    if (!entity || entity.isDeleted) throw new NotFoundException('Not found');

    return this.prisma.admin.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async updatePermit(id: number) {
    const prisma = this.prisma;
    return prisma.permit.update({
      where: { id },
      data: {
        status: PermitStatus.APPROVED,
        approvedAt: new Date(),
        verifiedById: id,
      },
    });
  }
}
