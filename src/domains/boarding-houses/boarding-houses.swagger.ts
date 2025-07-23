import { applyDecorators } from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CreateBoardingHouseDto } from './dto/create-boarding-house.dto';

export function CreateBoardingHouseDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new resource' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          ownerId: { type: 'number' },
          name: { type: 'string' },
          address: { type: 'string' },
          description: { type: 'string' },
          availabilityStatus: { type: 'boolean' },
          amenities: {
            type: 'array',
            items: { type: 'string' },
          },
          location: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              coordinates: {
                type: 'array',
                items: { type: 'number' },
              },
            },
          },
          rooms: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                roomNumber: { type: 'string' },
                maxCapacity: { type: 'number' },
                currentCapacity: { type: 'number' },
                price: { type: 'number' },
                tags: {
                  type: 'object',
                  additionalProperties: true,
                },
                roomType: { type: 'string' },
                availabilityStatus: { type: 'boolean' },
                gallery: {
                  type: 'array',
                  items: { type: 'string', format: 'binary' },
                },
              },
            },
          },
          thumbnail: { type: 'string', format: 'binary' },
          gallery: {
            type: 'array',
            items: { type: 'string', format: 'binary' },
          },
          main: {
            type: 'array',
            items: { type: 'string', format: 'binary' },
          },
          banner: {
            type: 'array',
            items: { type: 'string', format: 'binary' },
          },
        },
      },
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
            thumbnail: [
              { uri: 'sample file uri', name: 'sample name', type: '.png' },
            ],
            gallery: [
              { uri: 'sample file uri', name: 'sample name', type: '.png' },
              { uri: 'sample file uri', name: 'sample name', type: '.png' },
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
                gallery: [
                  { uri: 'sample file uri', name: 'sample name', type: '.png' },
                  { uri: 'sample file uri', name: 'sample name', type: '.png' },
                ],
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
                gallery: [
                  { uri: 'sample file uri', name: 'sample name', type: '.png' },
                  { uri: 'sample file uri', name: 'sample name', type: '.png' },
                ],
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
