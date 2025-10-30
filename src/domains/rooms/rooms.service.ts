import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IDatabaseService } from 'src/infrastructure/database/database.interface';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ImageService } from 'src/infrastructure/image/image.service';
// import { ImageService } from 'src/infrastructure/image/image.service';
import { MediaType, Prisma } from '@prisma/client';
import { CreateRoomsWithGallery } from './types';
import { ResourceType } from 'src/infrastructure/file-upload/types/resources-types';
import { DBClient } from 'src/infrastructure/image/types/types';

// * turn this into module later

@Injectable()
export class RoomsService {
  constructor(
    @Inject('IDatabaseService') private readonly database: IDatabaseService,
    private readonly imageService: ImageService,
  ) {}

  private get prisma(): PrismaService {
    return this.database.getClient();
  }

  async create(
    rooms: CreateRoomsWithGallery[],
    boardingHouseId: number,
    tx: DBClient = this.prisma,
  ): Promise<void> {
    for (const room of rooms) {
      const { gallery, thumbnail, ...roomData } = room;

      // Create the room first to get its ID
      const createdRoom = await tx.room.create({
        data: {
          ...roomData,
          boardingHouseId,
        },
      });

      // Optional: Upload gallery if provided
      if (gallery?.length) {
        await this.imageService.uploadImagesTransact(
          tx,
          gallery,
          {
            type: 'BOARDING_HOUSE_ROOMS',
            targetId: boardingHouseId,
            mediaType: MediaType.GALLERY,
            childId: createdRoom.id,
          },
          {
            resourceId: createdRoom.id,
            resourceType: ResourceType.ROOM,
            mediaType: MediaType.GALLERY,
          },
        );
      }

      if (thumbnail?.length) {
        await this.imageService.uploadImagesTransact(
          tx,
          thumbnail,
          {
            type: 'BOARDING_HOUSE_ROOMS',
            targetId: boardingHouseId,
            mediaType: MediaType.THUMBNAIL,
            childId: createdRoom.id,
          },
          {
            resourceId: createdRoom.id,
            resourceType: ResourceType.ROOM,
            mediaType: MediaType.THUMBNAIL,
          },
        );
      }
    }
  }

  async findAll(bhId: number) {
    const prisma = this.prisma;

    const room = await prisma.room.findMany({
      where: {
        boardingHouseId: bhId,
      },
    });

    const images = await this.prisma.image.findMany({
      where: {
        entityType: 'ROOM',
        entityId: bhId,
      },
    });

    // const thumbnail = images
    //   .filter((img) => img.type === 'THUMBNAIL')
    //   .map((img) => this.imageService.getMediaPath(img.url, true));

    // const gallery = images
    //   .filter((img) => img.type === 'GALLERY')
    //   .map((img) => this.imageService.getMediaPath(img.url, true));

    const { gallery, thumbnail } = await this.imageService.getImageMetaData(
      images,
      (url, isPublic) => this.imageService.getMediaPath(url, isPublic),
      ResourceType.ROOM,
      bhId,
      [MediaType.GALLERY],
    );

    if (!room) {
      throw new NotFoundException(
        'Room not found or does not belong to this boarding house.',
      );
    }
    return {
      ...room,
      thumbnail,
      gallery,
    };
  }

  async findOne(bhId: number, roomId: number) {
    const prisma = this.prisma;
    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        boardingHouseId: bhId,
      },
    });

    const images = await this.prisma.image.findMany({
      where: {
        entityId: roomId,
        entityType: ResourceType.ROOM,
      },
    });

    const { gallery } = await this.imageService.getImageMetaData(
      images,
      (url, isPublic) => this.imageService.getMediaPath(url, isPublic),
      ResourceType.ROOM,
      bhId,
      [MediaType.GALLERY],
    );

    const { thumbnail } = await this.imageService.getImageMetaData(
      images,
      (url, isPublic) => this.imageService.getMediaPath(url, isPublic),
      ResourceType.ROOM,
      bhId,
      [MediaType.THUMBNAIL],
    );

    if (!room) {
      throw new NotFoundException(
        'Room not found or does not belong to this boarding house.',
      );
    }

    return {
      ...room,
      thumbnail,
      gallery,
    };
  }

  async patch(roomId: number, roomData: UpdateRoomDto) {
    const prisma = this.prisma;
    return prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        ...roomData,
      },
    });
  }

  remove(id: number) {
    const prisma = this.prisma;
    return prisma.room.update({
      where: {
        id: id,
      },
      data: {
        isDeleted: true,
      },
    });
  }
}
