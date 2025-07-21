import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IDatabaseService } from 'src/infrastructure/database/database.interface';
import { CreateRoomsDto } from './dto/create-rooms.dto';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { UpdateRoomDto } from './dto/update-room.dto';

// * turn this into module later

@Injectable()
export class RoomsService {
  constructor(
    @Inject('IDatabaseService') private readonly database: IDatabaseService,
  ) {}

  private get prisma(): PrismaService {
    return this.database.getClient();
  }

  create(
    rooms: CreateRoomsDto[],
    boardingHouseId: number,
    prismaClient = this.prisma,
  ) {
    const roomsWithBHId = rooms.map((room) => ({
      ...room,
      boardingHouseId,
    }));

    return prismaClient.room.createMany({
      data: roomsWithBHId,
    });
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
