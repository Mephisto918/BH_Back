import { IsNotEmpty, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export class CreateBookingDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the tenant making the booking',
  })
  @IsNotEmpty()
  @IsNumber()
  tenantId!: number;

  @ApiProperty({
    example: 2,
    description: 'ID of the boarding house being booked',
  })
  @IsNotEmpty()
  @IsNumber()
  boardingHouseId!: number;

  @ApiProperty({
    example: '2025-07-08T10:00:00Z',
    description: 'Date when the booking is made',
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  dateBooked!: Date;

  @ApiProperty({
    example: '2025-07-15T12:00:00Z',
    description: 'Check-in date for the booking',
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  checkInDate!: Date;

  @ApiProperty({
    example: '2025-07-20T12:00:00Z',
    description: 'Check-out date for the booking',
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  checkOutDate!: Date;

  @ApiProperty({
    example: '2025-07-08T10:00:00Z',
    description: 'Timestamp of when the booking was created',
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({
    example: '2025-07-08T10:00:00Z',
    description: 'Timestamp of when the booking was last updated',
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  updatedAt!: Date;
}
