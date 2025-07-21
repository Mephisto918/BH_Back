import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { BoardingHousesService } from './boarding-houses.service';
import { CreateBoardingHouseDto } from './dto/create-boarding-house.dto';
import { UpdateBoardingHouseDto } from './dto/update-boarding-house.dto';
import {
  CreateBoardingHouseDoc,
  GetBoardingHousesDoc,
} from './boarding-houses.swagger';
import { FindBoardingHouseDto } from './dto/find-boarding-house.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerUploadConfig } from 'src/infrastructure/image/multer-upload.config';

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
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnail', maxCount: 1 },
        { name: 'gallery', maxCount: 10 },
        { name: 'main', maxCount: 1 },
      ],
      multerUploadConfig,
    ),
  )
  create(
    @Body() createBoardingHouseDto: CreateBoardingHouseDto,
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
      main?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    },
  ) {
    return this.boardingHousesService.create(
      createBoardingHouseDto,
      createBoardingHouseDto.location,
      files,
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
