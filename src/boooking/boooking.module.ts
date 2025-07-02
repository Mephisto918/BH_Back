import { Module } from '@nestjs/common';
import { BoookingService } from './boooking.service';
import { BoookingController } from './boooking.controller';

@Module({
  controllers: [BoookingController],
  providers: [BoookingService],
})
export class BoookingModule {}
