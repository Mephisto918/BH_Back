import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { IDatabaseService } from 'src/infrastructure/database/database.interface';
import { FindOwnersDto } from './dto/find-owners.dto';
import { Owner } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

/*
 * create a pdf service for certificate handling
 *
 */

@Injectable()
export class OwnersService {
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
  }: FindOwnersDto): Promise<Owner[]> {
    const userToSkip = (page - 1) * offset;

    const prisma = this.prisma;
    return prisma.owner.findMany({
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
    return prisma.owner.findUnique({
      where: {
        id: id,
      },
    });
  }

  findUserByUsername(username: string) {
    const prisma = this.prisma;
    return prisma.owner.findUnique({
      where: {
        username: username,
      },
    });
  }

  create(dto: CreateOwnerDto) {
    return this.prisma.owner.create({
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

  update(id: number, updateOwnerDto: UpdateOwnerDto) {
    const prisma = this.prisma;
    return prisma.owner.update({
      where: {
        id: id,
      },
      data: {
        username: updateOwnerDto.username,
        firstname: updateOwnerDto.firstname,
        lastname: updateOwnerDto.lastname,
        email: updateOwnerDto.email,
        // TODO: why uncommenting the password returns an error?
        // password: updateOwnerDto.password,
        age: updateOwnerDto.age,
        address: updateOwnerDto.address,
        phone_number: updateOwnerDto.phone_number,
      },
    });
  }

  remove(id: number) {
    // TODO: fix this
    const prisma = this.prisma;
    try {
      return prisma.owner.delete({ where: { id } });
    } catch (err: unknown) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException('Owner not found');
      }
      throw err; // Let Nest handle as 500
    }
  }
}

// TODO: fixe the delete function in service which returns no record found from prisma
/* sample reply from GPT
 * async remove(id: string): Promise<void> {
 *   try {
 *     await this.prisma.product.delete({ where: { id } });
 *   } catch (err) {
 *     if (this.isPrismaNotFoundError(err)) {
 *       throw new NotFoundException(`Product with id ${id} not found`);
 *     }
 *     throw err; // let global Nest handler log or map to 500
 *   }
 * }
 *
 * private isPrismaNotFoundError(err: unknown): err is { code: string } {
 *   return (
 *     typeof err === 'object' &&
 *     err !== null &&
 *     'code' in err &&
 *     (err as any).code === 'P2025'
 *   );
 * }
 *
 */
