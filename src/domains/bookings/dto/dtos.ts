import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';

import { IsInt } from 'class-validator';
import { BookingStatus, PaymentStatus, BookingType } from '@prisma/client';

/**
 * TENANT — Create Booking DTO
 * Requires tenantId (for now from body since no guard)
 */
export class CreateBookingDto {
  @IsNumber()
  tenantId!: number;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsOptional()
  @IsString()
  note?: string;
}

/**
 * Generic filter for GET /bookings
 */
export class FindAllBookingFilterDto {
  @IsOptional()
  @IsInt()
  tenantId?: number;

  @IsOptional()
  @IsInt()
  roomId?: number;

  @IsOptional()
  @IsInt()
  boardingHouseId?: number; // optional if you're joining Room → BoardingHouse later

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsEnum(BookingType)
  bookingType?: BookingType;

  @IsOptional()
  @IsDateString()
  fromCheckIn?: string;

  @IsOptional()
  @IsDateString()
  toCheckIn?: string;

  @IsOptional()
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @IsInt()
  limit?: number = 10;
}

/**
 * Find One booking DTO
 */
export class FindOneBookingDto {
  @IsNumber()
  requesterId!: number; // tenant or owner who requests
}

/**
 * TENANT — Patch booking (update/cancel)
 */
export class PatchTenantBookDto {
  @IsNumber()
  tenantId!: number;

  @IsOptional()
  @IsDateString()
  newStartDate?: string;

  @IsOptional()
  @IsDateString()
  newEndDate?: string;

  @IsOptional()
  @IsString()
  cancelReason?: string;
}

/**
 * OWNER — Approve booking request
 */
export class PatchApprovePayloadDTO {
  @IsNumber()
  ownerId!: number;

  @IsOptional()
  @IsString()
  message?: string; // optional message to tenant
}

/**
 * OWNER — Reject booking request
 */
export class PatchBookingRejectionPayloadDTO {
  @IsNumber()
  ownerId!: number;

  @IsString()
  reason!: string;
}

/**
 * TENANT — Upload payment proof
 */
export class CreatePaymentProofDTO {
  @IsNumber()
  tenantId!: number;

  // @IsString()
  // paymentProofUrl!: string; // could be file URL or base64

  @IsOptional()
  @IsString()
  note?: string;
}

/**
 * OWNER — Verify payment
 */
export class PatchVerifyPaymentDto {
  @IsNumber()
  ownerId!: number;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsEnum(BookingStatus)
  newStatus?: BookingStatus; // e.g. VERIFIED or REJECTED
}

/**
 * BOTH — Cancel Booking (shared)
 */
export class CancelBookingDto {
  @IsNumber()
  userId!: number; // can be tenant or owner

  @IsString()
  role!: 'TENANT' | 'OWNER';

  @IsOptional()
  @IsString()
  reason?: string;
}
