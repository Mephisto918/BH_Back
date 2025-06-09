import { Injectable } from '@nestjs/common';
import { IDatabaseService } from './database.interface';
import { PrismaService } from './prisma.service';

@Injectable()
export class DatabaseService implements IDatabaseService {
  constructor(private readonly prisma: PrismaService) {}

  async connect() {
    await this.prisma.$connect();
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }

  getClient(): PrismaService {
    return this.prisma;
  }
}
