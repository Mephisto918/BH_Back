import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateBoardingHouseDto } from './dto/create-boarding-house.dto';

export function CreateBoardingHouseDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new resource' }),
    ApiBody({
      type: CreateBoardingHouseDto,
      examples: {
        sample: {
          value: {
            ownerId: 1,
            owner: 'Echoes of Serenity',
            name: 'Sunset Horizon Retreat',
            address:
              'Jl. Melati No. 45, Kebayoran Baru, Jakarta Selatan, DKI Jakarta',
            description:
              'A tranquil place where comfort meets nature, perfect for relaxation and rejuvenation.',
            price: '198.75',
            availabilityStatus: false,
            amenities: ['WiFi', 'AirConditioning', 'Gym'],
            properties: {
              capacity: 15,
              type: 'Shared',
            },
            location: {
              latitude: 11.003229,
              longitude: 124.3041542,
              city: 'Jakarta',
              province: 'DKI Jakarta',
              country: 'Indonesia',
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'The resource has been successfully created.',
    }),
  );
}

export function GetBoardingHousesDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all boarding houses' }),
    ApiResponse({
      status: 200,
      example: {
        success: true,
        results: [
          {
            id: 1,
            owner: 'Sample owner',
            name: 'Pride Lotus Lodge',
            address: 'Jl. Raya Kecamatan, Jakarta Timur, DKI Jakarta',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            price: 123.23,
            availabilityStatus: true,
            amenities: ['Wifi', 'Kitchen', 'Pool'],
            properties: { capacity: 20, type: 'Private' },
            location: {
              latitude: 11.004229,
              longitude: 124.6041542,
              city: 'Jakarta',
              province: 'DKI Jakarta',
              country: 'Indonesia',
            },
          },
        ],
        timestamp: 'some other time',
      },
    }),
  );
}
