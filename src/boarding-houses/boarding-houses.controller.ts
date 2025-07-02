import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BoardingHousesService } from './boarding-houses.service';
import { CreateBoardingHouseDto } from './dto/create-boarding-house.dto';
import { UpdateBoardingHouseDto } from './dto/update-boarding-house.dto';
import { LocationDto } from './dto/location.dto';
import {
  CreateBoardingHouseDoc,
  GetBoardingHousesDoc,
} from './boarding-houses.swagger';

@Controller('boarding-houses')
export class BoardingHousesController {
  constructor(private readonly boardingHousesService: BoardingHousesService) {}

  @Get()
  @GetBoardingHousesDoc()
  findAll() {
    // TODO: add query params for pagination
    return this.boardingHousesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardingHousesService.findOne(+id);
  }

  @Post()
  @CreateBoardingHouseDoc()
  create(
    @Body() createBoardingHouseDto: CreateBoardingHouseDto,
    locationDto: LocationDto,
  ) {
    return this.boardingHousesService.create(
      createBoardingHouseDto,
      locationDto,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBoardingHouseDto: UpdateBoardingHouseDto,
  ) {
    return this.boardingHousesService.update(+id, updateBoardingHouseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardingHousesService.remove(+id);
  }
}
