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
              latitude: '12321.123123',
              longitude: '21323.3123',
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
              latitude: '12321.123123',
              longitude: '21323.3123',
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
