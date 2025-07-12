import { Module } from '@nestjs/common';
import { LocationService } from './location.service';

@Module({
  controllers: [],
  providers: [LocationService],
})
export class LocationModule {}
