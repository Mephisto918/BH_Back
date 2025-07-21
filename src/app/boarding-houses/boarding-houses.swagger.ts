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
            name: 'Azure Lake Villa',
            address: 'Jl. Anggrek No. 12, Menteng, Jakarta Pusat, DKI Jakarta',
            description:
              'Experience luxury and serenity by the lakeside, ideal for family gatherings and peaceful escapes.',
            availabilityStatus: true,
            amenities: ['WiFi', 'SwimmingPool', 'Parking'],
            thumbnail: ['https://example.com/thumbnail.jpg'],
            gallery: [
              'https://example.com/gallery.jpg',
              'https://example.com/gallery.jpg',
              'https://example.com/gallery.jpg',
            ],
            location: {
              longitude: 124.614262,
              latitude: 11.004296,
              city: 'Depok',
              province: 'West Java',
              country: 'Indonesia',
            },
            rooms: [
              {
                roomNumber: '101',
                maxCapacity: 1,
                currentCapacity: 1,
                price: '999.99',
                tags: {
                  windowFacing: 'lake',
                  airConditioned: true,
                },
                roomType: 'DUO',
                availabilityStatus: true,
              },
              {
                roomNumber: '102',
                maxCapacity: 1,
                currentCapacity: 1,
                price: '1299.99',
                tags: {
                  hasTV: true,
                  balcony: true,
                },
                roomType: 'SQUAD',
                availabilityStatus: true,
              },
            ],
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
