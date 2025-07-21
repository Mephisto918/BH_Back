import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardingHouseDto } from './dto/create-boarding-house.dto';
import { UpdateBoardingHouseDto } from './dto/update-boarding-house.dto';
import { IDatabaseService } from 'src/infrastructure/database/database.interface';

// TODO: clean this later
import { BoardingHouse, Prisma } from '@prisma/client';
import { LocationService } from 'src/infrastructure/location/location.service';
import { LocationDto } from 'src/infrastructure/location/dto/location.dto';
import { FindBoardingHouseDto } from './dto/find-boarding-house.dto';
import { RoomsService } from '../rooms/rooms.service';
import { MediaUploadsDto } from 'src/infrastructure/image/dto/media-upload.dto';
import { ImageService } from 'src/infrastructure/image/image.service';

@Injectable()
export class BoardingHousesService {
  constructor(
    @Inject('IDatabaseService') private readonly database: IDatabaseService,
    private readonly locationService: LocationService,
    private readonly roomsService: RoomsService,
    private readonly imageService: ImageService,
  ) {}

  private get prisma() {
    return this.database.getClient();
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
          rooms: true,
        },
      });

      const includeRawLocationPostGIST = await Promise.all(
        result.map(async (house) => {
          const rooms = house.rooms;
          const fullLocation = await this.locationService.findOne(
            house.locationId,
          );

          let totalCapacity = 0;
          let currentCapacity = 0;

          rooms.forEach((room) => {
            totalCapacity += room.maxCapacity;
            currentCapacity += room.currentCapacity;
          });

          return {
            ...house,
            capacity: {
              totalCapacity,
              currentCapacity,
            },
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
    images: {
      thumbnail?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
      main?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    },
  ) {
    const prisma = this.prisma;

    return prisma.$transaction(async (tx) => {
      const returnedLocationId =
        await this.locationService.create(locationData);
      // console.log('location id: ', returnedLocationId);

      const createBoardingHouse = await tx.boardingHouse.create({
        data: {
          owner: { connect: { id: boardinghouseData.ownerId } },
          name: boardinghouseData.name,
          address: boardinghouseData.address,
          description: boardinghouseData.description,
          // TODO: must check for cleaner code, availabilityStatus can have enums if applicable
          availabilityStatus: boardinghouseData.availabilityStatus,
          amenities: boardinghouseData.amenities ?? undefined,
          location: { connect: { id: returnedLocationId } },
        },
      });

      if (boardinghouseData.rooms && boardinghouseData.rooms.length > 0) {
        const roomsWithBHId = boardinghouseData.rooms.map((room) => ({
          ...room,
          boardingHouseId: createBoardingHouse.id,
        }));

        await tx.room.createMany({
          data: roomsWithBHId,
        });
      }

      if (images.thumbnail) {
        await this.imageService.processUploadInTransaction(
          tx,
          images.thumbnail,
          'BOARDING_HOUSE',
          createBoardingHouse.id,
          'THUMBNAIL',
        );
      }

      if (images.gallery) {
        await this.imageService.processUploadInTransaction(
          tx,
          images.gallery,
          'BOARDING_HOUSE',
          createBoardingHouse.id,
          'GALLERY',
        );
      }

      if (images.main) {
        await this.imageService.processUploadInTransaction(
          tx,
          images.main,
          'BOARDING_HOUSE',
          createBoardingHouse.id,
          'MAIN',
        );
      }

      if (images.banner) {
        await this.imageService.processUploadInTransaction(
          tx,
          images.banner,
          'BOARDING_HOUSE',
          createBoardingHouse.id,
          'BANNER',
        );
      }

      return {
        ...createBoardingHouse,
        location: await this.locationService.findOne(returnedLocationId),
      };
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
        availabilityStatus: updateBoardingHouseDto.availabilityStatus,
        // TODO: must check for cleaner code
        amenities: updateBoardingHouseDto.amenities ?? undefined,
        // TODO: must check for cleaner code
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
