import { Module } from '@nestjs/common';
import { BoardingHousesService } from './boarding-houses.service';
import { BoardingHousesController } from './boarding-houses.controller';
import { LocationModule } from 'src/infrastructure/location/location.module';
import { LocationService } from 'src/infrastructure/location/location.service';

@Module({
  imports: [LocationModule],
  controllers: [BoardingHousesController],
  providers: [BoardingHousesService, LocationService],
})
export class BoardingHousesModule {}
