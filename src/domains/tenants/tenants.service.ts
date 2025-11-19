import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IDatabaseService } from 'src/infrastructure/database/database.interface';

import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { FindTenantsDto } from './dto/find-tenants.dto';
import { Tenant } from '@prisma/client';

import { ImageService } from 'src/infrastructure/image/image.service';

@Injectable()
export class TenantsService {
  constructor(
    @Inject('IDatabaseService') private readonly database: IDatabaseService,
    private readonly imageService: ImageService,
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
  }: FindTenantsDto): Promise<Partial<Tenant>[]> {
    const userToSkip = (page - 1) * offset;

    return this.prisma.tenant.findMany({
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
    return prisma.tenant.findUnique({
      where: {
        id: id,
      },
    });
  }

  findByUsername(username: string) {
    const prisma = this.prisma;
    return prisma.tenant.findUnique({
      where: {
        username: username,
      },
    });
  }

  findUserById(userId: number) {
    const prisma = this.prisma;
    return prisma.tenant.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async create(dto: CreateTenantDto) {
    const prisma = this.prisma;

    try {
      // 1. Check if email or username already exists
      const existingTenant = await prisma.tenant.findFirst({
        where: {
          OR: [{ email: dto.email }, { username: dto.username }],
        },
      });

      if (existingTenant) {
        throw new ConflictException('Email or username already exists');
      }

      // 2. Hash the password
      // const hashedPassword = await bcrypt.hash(dto.password, 10);

      // 3. Create the tenant
      const tenant = await prisma.tenant.create({
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

      // 4. Return safe data (exclude password)
      const { password, ...safeTenant } = tenant;
      return {
        status: 'success',
        message: 'Tenant created successfully',
        data: safeTenant,
      };
    } catch (error) {
      console.error('Tenant creation error:', error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create tenant');
    }
  }
  // upload({ resourceType, resourceId, mediaType, file }: MediaUploadDto) {
  //   const result = this.imageService.processUpload(
  //     file,
  //     resourceType,
  //     resourceId,
  //     mediaType,
  //   );

  //   return result;
  // }

  // uploads({ resourceType, resourceId, mediaType, files }: MediaUploadsDto) {
  //   if (!files || files.length === 0) {
  //     throw new Error('No files provided');
  //   }
  //   const result = this.imageService.processUploads(
  //     files,
  //     resourceType,
  //     resourceId,
  //     mediaType,
  //   );

  //   return result;
  // }

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
        isDeleted: updateTenantDto.isDeleted,
      },
    });
  }

  async remove(id: number) {
    const prisma = this.prisma;
    const entity = await prisma.tenant.findUnique({ where: { id } });
    if (!entity || entity.isDeleted) throw new NotFoundException('Not found');

    return this.prisma.tenant.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
