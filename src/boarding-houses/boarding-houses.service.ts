import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardingHouseDto } from './dto/create-boarding-house.dto';
import { UpdateBoardingHouseDto } from './dto/update-boarding-house.dto';
import { IDatabaseService } from 'src/infrastructure/database/database.interface';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

// TODO: clean this later
import { BoardingHouse, Prisma } from '@prisma/client';
import { LocationService } from 'src/infrastructure/location/location.service';
import { LocationDto } from 'src/infrastructure/location/dto/location.dto';
import { FindBoardingHouseDto } from './dto/find-boarding-house.dto';

@Injectable()
export class BoardingHousesService {
  constructor(
    @Inject('IDatabaseService') private readonly database: IDatabaseService,
    private readonly locationService: LocationService,
  ) {}

  private get prisma() {
    return this.database.getClient() as PrismaService;
  }

  async findAll({
    id,
    ownerId,
    name,
    address,
    availabilityStatus,
    createdAt,
    updatedAt,
    isDeleted,
    deletedAt,
    minPrice = 0,
    maxPrice = 0,
    sortBy = 'name',
    page = 1,
    offset = 10,
  }: FindBoardingHouseDto): Promise<BoardingHouse[]> {
    const where: Prisma.BoardingHouseWhereInput = {};

    if (id !== undefined) where.id = +id;
    if (ownerId !== undefined) where.ownerId = +ownerId;
    if (name !== undefined)
      where.name = { contains: name, mode: 'insensitive' };
    if (address !== undefined)
      where.address = { contains: address, mode: 'insensitive' };
    if (availabilityStatus !== undefined)
      where.availabilityStatus = availabilityStatus;
    if (createdAt !== undefined) where.createdAt = createdAt;
    if (updatedAt !== undefined) where.updatedAt = updatedAt;
    if (isDeleted !== undefined) where.isDeleted = isDeleted;
    if (deletedAt !== undefined) where.deletedAt = deletedAt;

    // Handle price range filters more robustly
    if (minPrice > 0 || maxPrice > 0) {
      where.price = {
        ...(typeof where.price === 'object' ? where.price : {}),
        ...(minPrice > 0 ? { gte: minPrice } : {}),
        ...(maxPrice > 0 ? { lte: maxPrice } : {}),
      };
    }

    // Validate sortBy to prevent potential injection or errors
    const validSortFields = ['name', 'price', 'createdAt', 'updatedAt']; // extend as needed
    const orderByField = validSortFields.includes(sortBy) ? sortBy : 'name';

    try {
      const result = await this.prisma.boardingHouse.findMany({
        where,
        skip: (page - 1) * offset,
        take: offset,
        orderBy: {
          [orderByField]: 'asc',
        },
        include: {
          location: true,
        },
      });

      const includeRawLocationPostGIST = await Promise.all(
        result.map(async (house) => {
          const fullLocation = await this.locationService.findOne(
            house.locationId,
          );
          return {
            ...house,
            location: fullLocation,
          };
        }),
      );

      return includeRawLocationPostGIST;
    } catch (error: any) {
      throw new Error(`Error finding boarding houses: ${error}`);
    }
  }

  findOne(id: number) {
    const prisma = this.prisma;

    return prisma.boardingHouse.findUnique({
      where: {
        id,
      },
    });
  }

  async create(
    boardinghouseData: CreateBoardingHouseDto,
    locationData: LocationDto,
  ) {
    const prisma = this.prisma;

    return prisma.$transaction(async (tx) => {
      const returnedLocationId =
        await this.locationService.create(locationData);
      console.log('location id: ', returnedLocationId);

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
        location: { connect: { id: returnedLocationId } },
      };

      return tx.boardingHouse.create({
        data,
        include: {
          owner: true,
          location: true,
        },
      });
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

  async remove(id: number) {
    const prisma = this.prisma;
    const entity = await prisma.boardingHouse.findUnique({ where: { id } });
    if (!entity || entity.isDeleted) throw new NotFoundException('Not found');

    return this.prisma.boardingHouse.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
