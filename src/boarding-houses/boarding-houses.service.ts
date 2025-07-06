import { Inject, Injectable } from '@nestjs/common';
import { CreateBoardingHouseDto } from './dto/create-boarding-house.dto';
import { UpdateBoardingHouseDto } from './dto/update-boarding-house.dto';
import { IDatabaseService } from 'src/infrastructure/database/database.interface';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { LocationDto } from './dto/location.dto';

// TODO: clean this later
import { Prisma } from '@prisma/client';
import { LocationService } from './location.service';

@Injectable()
export class BoardingHousesService {
  constructor(
    @Inject('IDatabaseService') private readonly database: IDatabaseService,
    private readonly locationService: LocationService,
  ) {}

  private get prisma() {
    return this.database.getClient() as PrismaService;
  }

  async findAll() {
    const prisma = this.prisma;
    // TODO: add pagination but geolocation is a concern
    // json cleaning
    const data = await prisma.boardingHouse.findMany();

    const result = await Promise.all(
      data.map(async (house) => ({
        ...house,
        location: await this.locationService.findOne(house.locationId),
        amenities: house.amenities,
        properties: house.properties,
      })),
    );
    return result;

    // return prisma.boardingHouse.findMany({
    //   include: {
    //     location: true,
    //   },
    // });
  }

  findOne(id: number) {
    const prisma = this.prisma;

    return prisma.boardingHouse.findUnique({
      where: {
        id,
      },
    });
  }

  create(boardinghouseData: CreateBoardingHouseDto, locationData: LocationDto) {
    const prisma = this.prisma;

    // Explicitly type data as BoardingHouseCreateInput
    const data: Prisma.BoardingHouseCreateInput = {
      owner: { connect: { id: boardinghouseData.ownerId } },
      name: boardinghouseData.name,
      address: boardinghouseData.address,
      description: boardinghouseData.description,
      // TODO: must check for cleaner code
      price: boardinghouseData.price
        ? new Prisma.Decimal(boardinghouseData.price)
        : undefined,
      availabilityStatus: boardinghouseData.availabilityStatus,
      // TODO: must check for cleaner code
      amenities: boardinghouseData.amenities ?? undefined,
      // TODO: must check for cleaner code
      properties: boardinghouseData.properties ?? undefined,
      location: {
        create: {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          // TODO: must check for cleaner code
          ...(locationData.city && { city: locationData.city }),
          ...(locationData.province && { province: locationData.province }),
          ...(locationData.country && { country: locationData.country }),
        },
      },
    };

    return prisma.boardingHouse.create({
      data,
      include: {
        owner: true,
        location: true,
      },
    });
  }

  update(id: number, updateBoardingHouseDto: UpdateBoardingHouseDto) {
    const prisma = this.prisma;
    return prisma.boardingHouse.update({
      where: {
        id: id,
      },
      data: {
        name: updateBoardingHouseDto.name,
        address: updateBoardingHouseDto.address,
        description: updateBoardingHouseDto.description,
        // TODO: must check for cleaner code
        price: updateBoardingHouseDto.price
          ? new Prisma.Decimal(updateBoardingHouseDto.price)
          : undefined,
        availabilityStatus: updateBoardingHouseDto.availabilityStatus,
        // TODO: must check for cleaner code
        amenities: updateBoardingHouseDto.amenities ?? undefined,
        // TODO: must check for cleaner code
        properties: updateBoardingHouseDto.properties ?? undefined,
      },
    });
  }

  remove(id: number) {
    return this.prisma.boardingHouse.delete({ where: { id } });
  }
}
