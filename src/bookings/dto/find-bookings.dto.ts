import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsDate, Min, IsEnum } from 'class-validator';
import { BookingStatus } from './create-booking.dto';
/**
 * model Booking {
  id              Int           @id @default(autoincrement())
  tenantId        Int
  boardingHouseId Int
  tenant          Tenant        @relation(fields: [tenantId], references: [id], onDelete: Restrict)
  boardingHouse   BoardingHouse @relation(fields: [boardingHouseId], references: [id], onDelete: Restrict)
  dateBooked      DateTime
  checkInDate     DateTime
  checkOutDate    DateTime
  status          BookingStatus @default(PENDING)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}
 */

export class FindBookingsDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  tenantId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  boardingHouseId?: number;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fromCheckIn?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  toCheckIn?: Date;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}
