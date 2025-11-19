import { Module } from '@nestjs/common';
import { BoardingHousesService } from './boarding-houses.service';
import { BoardingHousesController } from './boarding-houses.controller';
import { LocationModule } from 'src/domains/location/location.module';
import { LocationService } from 'src/domains/location/location.service';
import { RoomsService } from '../rooms/rooms.service';
import { ImageModule } from 'src/infrastructure/image/image.module';

@Module({
  imports: [LocationModule, ImageModule],
  controllers: [BoardingHousesController],
  providers: [BoardingHousesService, LocationService, RoomsService],
})
export class BoardingHousesModule {}
