import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateAdminDto } from './dto/create-admin.dto';

export function CreateAdminsDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new resource' }),
    ApiBody({
      type: CreateAdminDto,
      examples: {
        sample: {
          value: {
            username: 'user123',
            firstname: 'John',
            lastname: 'Doe',
            email: 'ezVw2@example.com',
            password: 'password123',
            age: 30,
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

export function GetAdminsDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all owners' }),
    ApiResponse({
      status: 200,
      example: {
        success: true,
        results: [
          {
            id: 1,
            username: 'user123',
            firstname: 'John',
            lastname: 'Doe',
            email: 'ezVw2@example.com',
            password: 'password123',
            age: 30,
            address: '123 Main St',
            phone_number: '123-456-7890',
          },
        ],
        timestamp: 'some other time',
      },
    }),
  );
}
