import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [
    DatabaseService,
    PrismaService,
    {
      provide: 'IDatabaseService',
      useClass: DatabaseService,
    },
  ],
  exports: ['IDatabaseService'],
})
export class DatabaseModule {}
