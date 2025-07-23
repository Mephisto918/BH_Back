import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IDatabaseService } from 'src/infrastructure/database/database.interface';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ImageService } from 'src/infrastructure/image/image.service';
import { Prisma } from '@prisma/client';
import { CreateRoomsWithGallery } from './types';

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
    prismaClient: Prisma.TransactionClient = this.prisma,
  ): Promise<void> {
    for (const room of rooms) {
      const { gallery, ...roomData } = room;

      // Create room first to get ID
      const createdRoom = await prismaClient.room.create({
        data: {
          ...roomData,
          boardingHouseId,
        },
      });

      // Optional: Upload gallery if provided
      if (gallery?.length) {
        await this.imageService.processUploadInTransaction(
          prismaClient,
          gallery,
          'ROOM',
          createdRoom.id,
          'GALLERY',
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

    if (!room) {
      throw new NotFoundException(
        'Room not found or does not belong to this boarding house.',
      );
    }
    return room;
  }

  findOne(bhId: number, roomId: number) {
    const prisma = this.prisma;
    return prisma.room.findUnique({
      where: {
        id: roomId,
        boardingHouseId: bhId,
      },
    });
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
