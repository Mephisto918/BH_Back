import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IDatabaseService } from 'src/infrastructure/database/database.interface';
import {
  Booking,
  BookingStatus,
  MediaType,
  PaymentStatus,
} from '@prisma/client';

import {
  CreateBookingDto,
  FindOneBookingDto,
  PatchTenantBookDto,
  PatchApprovePayloadDTO,
  PatchBookingRejectionPayloadDTO,
  CreatePaymentProofDTO,
  PatchVerifyPaymentDto,
  FindAllBookingFilterDto,
  CancelBookingDto,
} from './dto/dtos';
import { ImageService } from 'src/infrastructure/image/image.service';
import { ResourceType } from 'src/infrastructure/file-upload/types/resources-types';
import { UserUnionService } from '../auth/userUnion.service';

@Injectable()
export class BookingsService {
  constructor(
    @Inject('IDatabaseService') private readonly database: IDatabaseService,
    private readonly userUnionService: UserUnionService,
    private readonly imageService: ImageService,
  ) {}

  private get prisma() {
    return this.database.getClient();
  }

  createBooking(roomId: number, booking: CreateBookingDto) {
    const prisma = this.prisma;
    return '';
  }

  findAll(filter: FindAllBookingFilterDto): Promise<Booking[]> {
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

  async findOne(bookId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: {
        id: bookId,
      },
    });

    return booking;
  }

  // TENANT: update or cancel booking (generic)
  async patchBooking(bookId: number, payload: PatchTenantBookDto) {
    const { tenantId, cancelReason, newEndDate, newStartDate } = payload;

    // 1️⃣ Validate booking access
    const booking = await this.validateBookingAccess(
      bookId,
      tenantId,
      'TENANT',
    );

    // 2️⃣ Disallow operations on finished/rejected/cancelled bookings
    const blockedStatuses = new Set<BookingStatus>([
      BookingStatus.CANCELLED,
      BookingStatus.COMPLETED,
      BookingStatus.REJECTED,
    ]);

    if (blockedStatuses.has(booking.status)) {
      throw new BadRequestException(
        'You cannot modify or cancel a completed or rejected booking',
      );
    }

    // 3️⃣ If cancelReason exists → cancel booking
    if (cancelReason) {
      return await this.prisma.booking.update({
        where: { id: bookId },
        data: {
          status: BookingStatus.CANCELLED,
          paymentStatus: PaymentStatus.NONE,
          tenantMessage: cancelReason,
          updatedAt: new Date(),
        },
      });
    }

    // 4️⃣ If new dates exist → update them (assuming your booking model supports it)
    if (newStartDate || newEndDate) {
      // Optional validation: prevent changing dates after confirmation
      if (booking.status !== BookingStatus.PENDING) {
        throw new BadRequestException(
          'You can only change dates for pending bookings',
        );
      }

      return await this.prisma.booking.update({
        where: { id: bookId },
        data: {
          checkInDate: newStartDate ?? booking.checkInDate,
          checkOutDate: newEndDate ?? booking.checkOutDate,
          updatedAt: new Date(),
        },
      });
    }

    // 5️⃣ If neither cancelReason nor new dates exist → invalid request
    throw new BadRequestException('No valid update data provided');
  }

  async patchApproveBooking(bookId: number, payload: PatchApprovePayloadDTO) {
    const { ownerId, message } = payload;
    const booking = await this.validateBookingAccess(bookId, ownerId, 'OWNER');

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException(
        'Only pending bookings can be approved by the owner',
      );
    }
    return await this.prisma.booking.update({
      where: { id: bookId },
      data: {
        status: BookingStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PENDING,
        ownerMessage: message ?? booking.ownerMessage,
        updatedAt: new Date(),
      },
    });
  }

  async patchRejectBooking(
    bookId: number,
    payload: PatchBookingRejectionPayloadDTO,
  ) {
    const { ownerId, reason } = payload;
    const booking = await this.validateBookingAccess(bookId, ownerId, 'OWNER');

    // Ensure it can still be rejected
    const blockedStatuses = new Set<BookingStatus>([
      BookingStatus.CANCELLED,
      BookingStatus.COMPLETED,
      BookingStatus.REJECTED,
    ]);

    if (blockedStatuses.has(booking.status)) {
      throw new BadRequestException('This booking cannot be rejected');
    }

    // Update booking and payment status
    booking.status = BookingStatus.REJECTED;
    booking.paymentStatus = PaymentStatus.REJECTED;
    booking.ownerMessage = reason;

    return await this.prisma.booking.update({
      where: { id: bookId },
      data: {
        status: BookingStatus.REJECTED,
        paymentStatus: PaymentStatus.REJECTED,
        ownerMessage: reason,
        updatedAt: new Date(),
      },
    });
  }

  async createPaymentProof(
    bookId: number,
    payload: CreatePaymentProofDTO,
    files: Express.Multer.File[],
  ) {
    const { tenantId, note } = payload;

    // 1️ Verify the booking exists and belongs to the tenant
    const booking = await this.validateBookingAccess(
      bookId,
      tenantId,
      'TENANT',
    );

    // 2️ Verify booking status is valid for uploading payment proof
    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('This booking is not awaiting payment');
    }

    // 3️ Upload the image(s)
    return this.prisma.$transaction(async (tx) => {
      const uploadedImageIds = await this.imageService.uploadImagesTransact(
        tx,
        files,
        {
          type: 'TENANT',
          targetId: +tenantId,
          childId: bookId,
          mediaType: MediaType.GALLERY,
        },
        {
          resourceId: +tenantId,
          resourceType: ResourceType.TENANT,
          mediaType: MediaType.GALLERY,
        },
      );

      // 4️ Get the first image URL (if you store the main proof URL)
      const proofImage = await this.prisma.image.findUnique({
        where: { id: uploadedImageIds[0] },
      });

      // 5️ Update the booking with payment proof info
      const updatedBooking = await this.prisma.booking.update({
        where: { id: booking.id },
        data: {
          paymentProofUrl: proofImage?.url ?? null,
          paymentStatus: 'PENDING',
          tenantMessage: note ?? null,
          status: 'AWAITING_PAYMENT', // or another transitional state
        },
      });

      return updatedBooking;
    });
  }

  async verifyPayment(bookId: number, payload: PatchVerifyPaymentDto) {
    const { ownerId, newStatus, remarks } = payload;

    // 2 Compute new payment + booking status
    const booking = await this.validateBookingAccess(bookId, ownerId, 'OWNER');

    // 3️ Compute new payment + booking status
    const paymentStatus =
      newStatus !== undefined
        ? this.checkPaymentStatus(newStatus)
        : booking.paymentStatus;

    // 4️ Update booking record
    const updated = await this.prisma.booking.update({
      where: { id: bookId },
      data: {
        paymentStatus,
        status: newStatus ?? booking.status,
        ownerMessage: remarks ?? booking.ownerMessage,
        updatedAt: new Date(),
      },
    });

    return updated;
  }

  async cancelBooking(bookId: number, payload: CancelBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookId },
      include: {
        room: {
          include: {
            boardingHouse: {
              select: { ownerId: true },
            },
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Ensure the user has authority to cancel
    const { userId, role } = payload;

    // If tenant cancels their own booking
    if (role === 'TENANT' && booking.tenantId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to cancel this booking',
      );
    }

    // If owner cancels a tenant’s booking (e.g., due to policy, expired payment, etc.)
    if (role === 'OWNER' && booking.room.boardingHouse.ownerId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to cancel this booking',
      );
    }

    // Perform the cancellation logic
    const updated = await this.prisma.booking.update({
      where: { id: bookId },
      data: {
        status: 'CANCELLED',
        ownerMessage: role === 'OWNER' ? payload.reason : booking.ownerMessage,
        tenantMessage:
          role === 'TENANT' ? payload.reason : booking.tenantMessage,
      },
    });

    return updated;
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

  async validateBookingAccess(
    bookId: number,
    userId: number,
    role: 'TENANT' | 'OWNER',
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookId },
      include: {
        room: {
          include: {
            boardingHouse: {
              select: { ownerId: true },
            },
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (role === 'TENANT') {
      if (booking.tenantId !== userId) {
        throw new ForbiddenException(
          'You are not authorized to access this booking',
        );
      }
    } else if (role === 'OWNER') {
      if (booking.room.boardingHouse.ownerId !== userId) {
        throw new ForbiddenException(
          'You are not authorized to manage this booking',
        );
      }
    }

    return booking; // ✅ return it so the caller can use the data directly
  }

  checkPaymentStatus(newStatus?: BookingStatus): PaymentStatus {
    let paymentStatus: PaymentStatus;
    switch (newStatus) {
      case BookingStatus.CONFIRMED:
      case BookingStatus.PAYMENT_VERIFIED:
        return (paymentStatus = PaymentStatus.VERIFIED);
      case BookingStatus.REJECTED:
        return (paymentStatus = PaymentStatus.REJECTED);
      default:
        return (paymentStatus = PaymentStatus.NONE);
    }
  }
}
