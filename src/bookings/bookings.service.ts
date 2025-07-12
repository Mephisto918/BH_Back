import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { IDatabaseService } from 'src/infrastructure/database/database.interface';
import { FindBookingsDto } from './dto/find-bookings.dto';
import { Booking } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(
    @Inject('IDatabaseService') private readonly database: IDatabaseService,
  ) {}

  private get prisma() {
    return this.database.getClient() as PrismaService;
  }

  findAll(filter: FindBookingsDto): Promise<Booking[]> {
    const {
      tenantId,
      boardingHouseId,
      status,
      fromCheckIn,
      toCheckIn,
      page = 1,
      limit = 10,
    } = filter;
    const toSkip = (page - 1) * limit;

    const prisma = this.prisma;
    return prisma.booking.findMany({
      skip: toSkip,
      take: limit,
      where: {
        ...(tenantId && { tenantId }),
        ...(boardingHouseId && { boardingHouseId }),
        ...(status && { status }),
        ...(fromCheckIn &&
          toCheckIn && { checkInDate: { gte: fromCheckIn, lte: toCheckIn } }),
      },
      orderBy: { checkInDate: 'asc' },
    });
  }

  findOne(id: number) {
    const prisma = this.prisma;
    return prisma.booking.findUnique({
      where: {
        id,
      },
    });
  }

  create(booking: CreateBookingDto) {
    const prisma = this.prisma;
    return prisma.booking.create({
      data: booking,
    });
  }

  update(id: number, dto: UpdateBookingDto) {
    const prisma = this.prisma;
    return prisma.booking.update({
      where: {
        id: id,
      },
      data: dto,
    });
  }

  async remove(id: number) {
    const prisma = this.prisma;
    const entity = await prisma.booking.findUnique({ where: { id } });
    if (!entity || entity.isDeleted) throw new NotFoundException('Not found');

    return this.prisma.booking.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
