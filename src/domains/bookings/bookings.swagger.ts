import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateBookingDto } from './dto/dtos';

export function CreateBookingDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a booking' }),
    ApiBody({
      type: CreateBookingDto,
      examples: {
        sample: {
          value: {
            tenantId: 1,
            boardingHouseId: 2,
            dateBooked: '2025-07-08T10:00:00.000Z',
            checkInDate: '2025-07-15T14:00:00.000Z',
            checkOutDate: '2025-07-20T10:00:00.000Z',
            status: 'PENDING',
            createdAt: '2025-07-08T10:00:00.000Z',
            updatedAt: '2025-07-08T10:00:00.000Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'The resource has been successfully created.',
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request: Invalid Input!',
    }),
  );
}
