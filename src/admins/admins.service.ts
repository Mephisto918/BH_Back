import { Inject, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { IDatabaseService } from 'src/infrastructure/database/database.interface';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { FindAdminsDto } from './dto/find-admins.dto';
import { Admin } from '@prisma/client';

/*
 *
 *
 */

@Injectable()
export class AdminsService {
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
      },
    });
  }

  remove(id: number) {
    const prisma = this.prisma;
    return prisma.admin.delete({
      where: {
        id,
      },
    });
  }
}
