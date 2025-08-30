import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { IDatabaseService } from 'src/infrastructure/database/database.interface';
import { FindOwnersDto } from './dto/find-owners.dto';
import { FileFormat, MediaType, Owner } from '@prisma/client';
// import { Multer } from 'multer';
import { Express } from 'express';
import { PermitService } from '../../infrastructure/permit/permit.service';
import { CreatePermitDto } from 'src/infrastructure/permit/dto/create-permit.dto';

/*
 * create a pdf service for certificate handling
 *
 */

@Injectable()
export class OwnersService {
  constructor(
    @Inject('IDatabaseService') private readonly database: IDatabaseService,
    private readonly permitService: PermitService,
  ) {}

  private get prisma() {
    return this.database.getClient();
  }

  findAll({
    username = '',
    page = 1,
    offset = 15,
    isDeleted = false,
    isActive,
    isVerified,
  }: FindOwnersDto): Promise<Partial<Owner>[]> {
    const userToSkip = (page - 1) * offset;

    return this.prisma.owner.findMany({
      skip: userToSkip,
      take: offset,
      where: {
        ...(username !== undefined &&
          username.trim() !== '' && {
            username: { contains: username, mode: 'insensitive' },
          }),
        isDeleted,
        ...(isActive !== undefined && { isActive }),
        ...(isVerified !== undefined && { isVerified }),
      },
      orderBy: { username: 'asc' },
      select: {
        id: true,
        username: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findOne(id: number) {
    const prisma = this.prisma;
    return prisma.owner.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        username: true,
        firstname: true,
        lastname: true,
        email: true,
        password: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        age: true,
        address: true,
        phone_number: true,
        isDeleted: true,
        deletedAt: true,
        boardingHouses: {
          select: {
            id: true,
          },
        },
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

  async createPermit(payload: CreatePermitDto, file: Express.Multer.File) {
    try {
      const id = await this.prisma.$transaction(async (tx) => {
        return await this.permitService.create(
          tx,
          file,
          {
            type: 'OWNER',
            targetId: payload.ownerId,
            mediaType: MediaType.DOCUMENT,
          },
          {
            ownerId: payload.ownerId,
            expiresAt: payload.expiresAt,
            type: payload.type,
            fileFormat: FileFormat.PDF,
          },
          false,
        );
      });
      return id;
    } catch (error: any) {
      console.log('error', error); // TODO fix that shiii
      throw error;
    }
  }

  async findAllPermits() {
    const prisma = this.prisma;
    // return await this.permitService.getPermitMetaData(prisma, id, false);
    const permits = await prisma.permit.findMany();

    return Promise.all(
      permits.map((permit) =>
        this.permitService.getPermitMetaData(prisma, permit.id, false),
      ),
    );
  }
  async findOnePermits(id: number) {
    const prisma = this.prisma;
    const permit = await this.permitService.getPermitMetaData(
      prisma,
      id,
      false,
    );

    return permit;
  }

  async removePermit(permitId: number) {
    return this.prisma.$transaction(async (tx) => {
      // Get permit to find the filePath/url
      const permit = await tx.permit.findUnique({ where: { id: permitId } });
      if (!permit) {
        throw new Error(`Permit ${permitId} not found`);
      }

      // Delete permit file + db record atomically as possible
      await this.permitService.deletePermit(tx, permitId, permit.url, false);

      return { success: true };
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
        isDeleted: updateOwnerDto.isDeleted,
      },
    });
  }

  async remove(id: number) {
    // TODO: fix this
    const prisma = this.prisma;
    const entity = await prisma.owner.findUnique({ where: { id } });
    if (!entity || entity.isDeleted) throw new NotFoundException('Not found');

    return this.prisma.owner.update({
      where: { id },
      data: { isDeleted: true },
    });
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
