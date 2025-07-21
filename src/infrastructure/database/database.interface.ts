import { PrismaService } from './prisma.service';

export interface IDatabaseService {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getClient(): PrismaService;
}
