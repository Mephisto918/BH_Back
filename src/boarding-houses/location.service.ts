// TODO: make this a seperate module
/*
 * location/
 *   ├── location.module.ts
 *   ├── location.service.ts
 *   ├── dto/
 *   └── postgis-utils.ts (if you want to separate)
 */

import { Inject, Injectable } from '@nestjs/common';
import { IDatabaseService } from 'src/infrastructure/database/database.interface';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class LocationService {
  constructor(
    @Inject('IDatabaseService') private readonly database: IDatabaseService,
  ) {}

  private get prisma() {
    return this.database.getClient() as PrismaService;
  }

  async findAll() {
    const prisma = this.prisma;
    return await prisma.location.findMany();
  }

  async findOne(id: number) {
    const prisma = this.prisma;
    const dataLocation = await prisma.location.findUnique({
      where: {
        id,
      },
    });

    return dataLocation;
  }
}
