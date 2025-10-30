import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardingHouseDto } from './dto/create-boarding-house.dto';
import { UpdateBoardingHouseDto } from './dto/update-boarding-house.dto';
import { IDatabaseService } from 'src/infrastructure/database/database.interface';

// TODO: clean this later
import { BoardingHouse, MediaType, Prisma } from '@prisma/client';
import { ResourceType } from 'src/infrastructure/file-upload/types/resources-types';
import { LocationService } from 'src/infrastructure/location/location.service';
import { LocationDto } from 'src/infrastructure/location/dto/location.dto';
import { FindBoardingHouseDto } from './dto/find-boarding-house.dto';
import { RoomsService } from '../rooms/rooms.service';
import { ImageService } from 'src/infrastructure/image/image.service';
import { FileMap } from 'src/common/types/file.type';

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
          const { rooms, ...houseData } = house;
          const roomsIdArray = rooms.map((room) => room.id);
          const roomsWithImages = await Promise.all(
            roomsIdArray.map(async (roomId) => {
              const room = await this.roomsService.findOne(house.id, roomId);
              return room;
            }),
          );

          const fullLocation = await this.locationService.findOne(
            house.locationId,
          );

          let totalCapacity = 0;
          let currentCapacity = 0;

          house.rooms.forEach((room) => {
            totalCapacity += room.maxCapacity;
            currentCapacity += room.currentCapacity;
          });

          const images = await this.prisma.image.findMany({
            where: {
              entityId: house.id,
              entityType: ResourceType.BOARDING_HOUSE,
            },
          });

          const { gallery, thumbnail } =
            await this.imageService.getImageMetaData(
              images,
              (url, isPublic) => this.imageService.getMediaPath(url, isPublic),
              ResourceType.BOARDING_HOUSE,
              house.id,
              [MediaType.GALLERY, MediaType.THUMBNAIL],
            );

          return {
            ...houseData,
            rooms: roomsWithImages,
            capacity: {
              totalCapacity,
              currentCapacity,
            },
            location: fullLocation,
            thumbnail,
            gallery,
          };
        }),
      );

      return includeRawLocationPostGIST;
    } catch (error: any) {
      throw new Error(`Error finding boarding houses: ${error}`);
    }
  }

  async findOne(id: number) {
    const prisma = this.prisma;

    try {
      const house = await prisma.boardingHouse.findUnique({
        where: { id },
        include: {
          location: true,
          rooms: true,
        },
      });

      if (!house) {
        throw new NotFoundException(`Boarding house with id ${id} not found`);
        // throw new Error();
      }

      // Destructure house and handle rooms separately
      const { rooms, ...houseData } = house;

      // Get rooms with images (via your RoomsService)
      const roomsWithImages = await Promise.all(
        rooms.map((room) => this.roomsService.findOne(house.id, room.id)),
      );

      // Fetch location (raw from PostGIS service)
      const fullLocation = await this.locationService.findOne(house.locationId);

      // Compute capacity
      const totalCapacity = rooms.reduce((acc, r) => acc + r.maxCapacity, 0);
      const currentCapacity = rooms.reduce(
        (acc, r) => acc + r.currentCapacity,
        0,
      );

      // Fetch images for this house
      const images = await this.prisma.image.findMany({
        where: {
          entityId: house.id,
          entityType: 'BOARDING_HOUSE',
        },
      });

      const { gallery, thumbnail } = await this.imageService.getImageMetaData(
        images,
        (url, isPublic) => this.imageService.getMediaPath(url, isPublic),
        ResourceType.BOARDING_HOUSE,
        house.id,
        [MediaType.GALLERY, MediaType.THUMBNAIL],
      );

      // Return enriched house object
      return {
        ...houseData,
        rooms: roomsWithImages,
        capacity: {
          totalCapacity,
          currentCapacity,
        },
        location: fullLocation,
        thumbnail,
        gallery,
      };
    } catch (error: any) {
      throw new NotFoundException(`Boarding house with id ${id} not found`);
    }
  }

  async create(
    boardinghouseData: CreateBoardingHouseDto,
    locationData: LocationDto,
    images: FileMap,
  ) {
    const prisma = this.prisma;

    return prisma.$transaction(async (tx) => {
      const returnedLocationId =
        await this.locationService.create(locationData);

      const createBoardingHouse = await tx.boardingHouse.create({
        data: {
          owner: { connect: { id: boardinghouseData.ownerId } },
          name: boardinghouseData.name,
          address: boardinghouseData.address,
          description: boardinghouseData.description,
          availabilityStatus: boardinghouseData.availabilityStatus,
          amenities: boardinghouseData.amenities ?? undefined,
          location: { connect: { id: returnedLocationId } },
        },
      });

      if (boardinghouseData.rooms?.length) {
        await this.roomsService.create(
          boardinghouseData.rooms,
          createBoardingHouse.id,
          tx,
        );
      }

      if (images.thumbnail) {
        await this.imageService.uploadImagesTransact(
          tx,
          images.thumbnail,
          {
            type: 'BOARDING_HOUSE',
            targetId: createBoardingHouse.id,
            mediaType: MediaType.THUMBNAIL,
          },
          {
            resourceId: createBoardingHouse.id,
            resourceType: ResourceType.BOARDING_HOUSE,
            mediaType: MediaType.THUMBNAIL,
          },
        );
      }

      if (images.gallery) {
        await this.imageService.uploadImagesTransact(
          tx,
          images.gallery,
          {
            type: 'BOARDING_HOUSE',
            targetId: createBoardingHouse.id,
            mediaType: MediaType.GALLERY,
          },
          {
            resourceId: createBoardingHouse.id,
            resourceType: ResourceType.BOARDING_HOUSE,
            mediaType: MediaType.GALLERY,
          },
        );
      }

      if (images.main) {
        await this.imageService.uploadImagesTransact(
          tx,
          images.main,
          {
            type: 'BOARDING_HOUSE',
            targetId: createBoardingHouse.id,
            mediaType: MediaType.MAIN,
          },
          {
            resourceId: createBoardingHouse.id,
            resourceType: ResourceType.BOARDING_HOUSE,
            mediaType: MediaType.MAIN,
          },
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

  // TODO: delete images
  // TODO: update images
  async removeGallery(id: number) {
    return this.prisma.$transaction(async (tx) => {
      // Get permit to find the filePath/url
      const permit = await tx.permit.findUnique({ where: { id: id } });
      if (!permit) {
        throw new Error(`Permit ${id} not found`);
      }

      // Delete permit file + db record atomically as possible
      await this.imageService.deletePermit(tx, id, permit.url, false);

      return { success: true };
    });
  }

  async galleryCreate(id: number, images: FileMap) {
    const prisma = this.prisma;
    //   return await this.imageService.uploadImages(
    //     prisma,
    //     images.gallery,
    //     {
    //       type: 'BOARDING_HOUSE',
    //       targetId: id,
    //       mediaType: MediaType.GALLERY,
    //     },
    //     {
    //       resourceId: id,
    //       resourceType: ResourceType.BOARDING_HOUSE,
    //       mediaType: MediaType.GALLERY,
    //     },
    //   );
    // }
    return 'not finished route'; //!
  }
}
