import { Module } from '@nestjs/common';
import { BoardingHousesService } from './boarding-houses.service';
import { BoardingHousesController } from './boarding-houses.controller';
import { LocationService } from './location.service';

@Module({
  controllers: [BoardingHousesController],
  providers: [BoardingHousesService, LocationService],
})
export class BoardingHousesModule {}
