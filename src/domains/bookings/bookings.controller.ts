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
import { BookingsService } from './bookings.service';
import {
  CreateBookingDto,
  FindOneBookingDto,
  PatchTenantBookDto,
  PatchApprovePayloadDTO,
  PatchBookingRejectionPayloadDTO,
  CreatePaymentProofDTO,
  PatchVerifyPaymentDto,
} from './dto/dtos';
import { ApiTags } from '@nestjs/swagger';
import { createMulterConfig } from 'src/infrastructure/shared/utils/multer-config.util';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // TENANT: create a booking for a room
  @Post(':roomId')
  createBooking(
    @Param('roomId') roomId: string,
    @Body() payload: CreateBookingDto,
  ) {
    // needs tenantId
    return this.bookingsService.createBooking(+roomId, payload);
  }

  // ADMIN or OWNER: view all bookings (with optional filters)
  @Get()
  findAll(@Query() filter: any) {
    return this.bookingsService.findAll(filter);
  }

  // TENANT or OWNER: view single booking detail
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(+id);
  }

  // TENANT: update or cancel booking (generic)
  @Patch(':id')
  patchBooking(@Param('id') id: string, @Body() payload: PatchTenantBookDto) {
    // needs tenant id on  the body
    return this.bookingsService.patchBooking(+id, payload);
  }

  // OWNER: approve booking request
  @Patch(':id/owner/approve')
  patchApproveBookingRequest(
    @Param('id') id: string,
    @Body() approvePayload: PatchApprovePayloadDTO,
  ) {
    return this.bookingsService.patchApproveBooking(+id, approvePayload);
  }

  // OWNER: reject booking request
  @Patch(':id/owner/reject')
  patchRejectBookingRequest(
    @Param('id') id: string,
    @Body() bookingRejectionPayload: PatchBookingRejectionPayloadDTO,
  ) {
    return this.bookingsService.patchRejectBooking(
      +id,
      bookingRejectionPayload,
    );
  }

  // TENANT: upload payment proof
  @Post(':id/payment-proof')
  @UseInterceptors(AnyFilesInterceptor(createMulterConfig('image')))
  createPaymentProof(
    @Param('id') id: string,
    @Body() payload: Record<string, string>,
    // @Body() dto: CreatePaymentProofDTO,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const fileMap = files.reduce(
      (acc, file) => {
        acc[file.fieldname] = acc[file.fieldname] || [];
        acc[file.fieldname].push(file);
        return acc;
      },
      {} as Record<string, Express.Multer.File[]>,
    );

    const createPaymentProof: CreatePaymentProofDTO = {
      ...payload,
      tenantId: +payload.tenantId,
    };

    return this.bookingsService.createPaymentProof(
      +id,
      createPaymentProof,
      files,
    );
  }

  // OWNER: verify payment after tenant uploaded proof
  @Patch(':id/owner/verify-payment')
  patchPaymentStatus(
    @Param('id') id: string,
    @Body() payload: PatchVerifyPaymentDto,
  ) {
    return this.bookingsService.verifyPayment(+id, payload);
  }

  // 📌 BOTH TENANT & OWNER can cancel booking (shared)
  @Post(':id/cancel')
  createCancelResponse(@Param('id') id: string, @Body() payload: any) {
    // tenant or owner id on payload
    return this.bookingsService.cancelBooking(+id, payload);
  }
}
