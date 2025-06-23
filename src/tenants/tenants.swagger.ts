import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateTenantDto } from './dto/create-tenant.dto';

export function CreateTenantDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new resource' }),
    ApiBody({
      type: CreateTenantDto,
      examples: {
        sample: {
          value: {
            username: 'user123',
            firstname: 'John',
            lastname: 'Doe',
            email: 'ezVw2@example.com',
            password: 'password123',
            age: 30,
            guardian: 'Jane Doe',
            address: '123 Main St',
            phone_number: '123-456-7890',
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

export function GetTenantDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all tenants' }),
    ApiResponse({
      status: 200,
      example: {
        success: true,
        results: [
          {
            id: 1,
            username: 'startlord',
            firstname: 'Star',
            lastname: 'Lord',
            email: 'star@lord.com',
            password: '12345678',
            role: 'TENANT',
            isActive: true,
            isVerified: false,
            createdAt: '2025-06-09T15:56:46.899Z',
            updatedAt: '2025-06-09T15:56:46.899Z',
            age: 23,
            guardian: 'Guardians Of the GALAXY',
            address: 'Egos home',
            phone_number: '092313231231',
          },
        ],
        timestamp: '2025-06-23T11:27:29.360Z',
      },
    }),
  );
}
