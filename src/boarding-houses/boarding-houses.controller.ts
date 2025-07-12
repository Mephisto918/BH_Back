import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BoardingHousesService } from './boarding-houses.service';
import { CreateBoardingHouseDto } from './dto/create-boarding-house.dto';
import { UpdateBoardingHouseDto } from './dto/update-boarding-house.dto';
import {
  CreateBoardingHouseDoc,
  GetBoardingHousesDoc,
} from './boarding-houses.swagger';
import { FindBoardingHouseDto } from './dto/find-boarding-house.dto';

@Controller('boarding-houses')
export class BoardingHousesController {
  constructor(private readonly boardingHousesService: BoardingHousesService) {}

  @Get()
  @GetBoardingHousesDoc()
  findAll(@Query() filter: FindBoardingHouseDto) {
    // TODO: add query params for pagination
    return this.boardingHousesService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardingHousesService.findOne(+id);
  }

  @Post()
  @CreateBoardingHouseDoc()
  create(@Body() createBoardingHouseDto: CreateBoardingHouseDto) {
    const locationData = createBoardingHouseDto.location;
    return this.boardingHousesService.create(
      createBoardingHouseDto,
      locationData,
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
