import { applyDecorators } from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
// import { Create}

export function CreateBookingDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all boarding houses' }),
    ApiBody({
      schema: {
        type: 'json',
        properties: {
          tenantId: { type: 'number' },
          startDate: { type: 'Date' },
          endDate: { type: 'Date' },
        },
        example: {
          test: {
            tenantId: 1,
            startDate: '2025-10-28T10:00:00.000Z',
            endDate: '2025-11-28T10:00:00.000Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      example: {
        success: true,
        results: {
          id: 1,
          reference: 'BK-1761585557294',
          tenantId: 1,
          roomId: 4,
          bookingType: 'RESERVATION',
          dateBooked: '2025-10-27T17:19:17.294Z',
          checkInDate: '2025-10-28T10:00:00.000Z',
          checkOutDate: '2025-11-28T10:00:00.000Z',
          status: 'PENDING',
          paymentStatus: 'NONE',
          paymentProofUrl: null,
          totalAmount: null,
          currency: 'PHP',
          ownerMessage: null,
          tenantMessage: null,
          expiresAt: null,
          createdAt: '2025-10-27T17:19:17.305Z',
          updatedAt: '2025-10-27T17:19:17.305Z',
          isDeleted: false,
          deletedAt: null,
        },
        timestamp: '2025-10-27T17:19:17.406Z',
      },
    }),
  );
}
