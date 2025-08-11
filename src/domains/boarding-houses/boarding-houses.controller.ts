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
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { createMulterConfig } from 'src/infrastructure/shared/utils/multer-config.util';
// import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

@Controller('boarding-houses')
export class BoardingHousesController {
  // private readonly imageUploadOptions: MulterOptions =
  //   createMulterConfig('image');

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
  @UseInterceptors(AnyFilesInterceptor(createMulterConfig('image')))
  create(
    @Body()
    payload: Record<string, string>,
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    // group files manually by fieldname
    const fileMap = files.reduce(
      (acc, file) => {
        acc[file.fieldname] = acc[file.fieldname] || [];
        acc[file.fieldname].push(file);
        return acc;
      },
      {} as Record<string, Express.Multer.File[]>,
    );

    // 1. Construct typed CreateBoardingHouseDto
    const parsedRooms = JSON.parse(
      payload.rooms ?? '[]',
    ) as CreateBoardingHouseDto['rooms'];
    const parsedLocation = JSON.parse(
      payload.location,
    ) as CreateBoardingHouseDto['location'];
    const parsedAmenities = JSON.parse(
      payload.amenities ?? '[]',
    ) as CreateBoardingHouseDto['amenities'];

    const createBoardingHouseDto: CreateBoardingHouseDto = {
      ...payload,
      ownerId: Number(payload.ownerId),
      availabilityStatus: payload.availabilityStatus === 'true',
      name: payload.name,
      address: payload.address,
      description: payload.description ?? '',
      amenities: parsedAmenities,
      location: parsedLocation,
      rooms: parsedRooms ?? [],
    };

    // 2. Merge dynamic roomGalleryX files back into rooms[]
    createBoardingHouseDto.rooms = (createBoardingHouseDto.rooms ?? []).map(
      (room, index) => {
        const key = `roomGallery${index}`;
        const gallery = fileMap[key] ?? [];
        return {
          ...room,
          gallery,
        };
      },
    );

    // 3. Extract standard image fields
    const imageFiles = {
      thumbnail: fileMap.thumbnail ?? [],
      gallery: fileMap.gallery ?? [],
      main: fileMap.main ?? [],
      banner: fileMap.banner ?? [],
    };

    return this.boardingHousesService.create(
      createBoardingHouseDto,
      createBoardingHouseDto.location,
      imageFiles,
    );
  }

  @Post(':id/gallery')
  @UseInterceptors(AnyFilesInterceptor(createMulterConfig('image')))
  galleryCreate(
    @Param('id') id: string,
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    // group files manually by fieldname
    const fileMap = files.reduce(
      (acc, file) => {
        acc[file.fieldname] = acc[file.fieldname] || [];
        acc[file.fieldname].push(file);
        return acc;
      },
      {} as Record<string, Express.Multer.File[]>,
    );
    const imageFiles = {
      thumbnail: fileMap.thumbnail ?? [],
      gallery: fileMap.gallery ?? [],
      main: fileMap.main ?? [],
      banner: fileMap.banner ?? [],
    };
    return this.boardingHousesService.galleryCreate(+id, imageFiles);
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

  // @Delete(':id/gallery')
  // removeGallery(@Param('id') id: string) {
  //   return this.boardingHousesService.removeGallery(+id);
  // }
}
