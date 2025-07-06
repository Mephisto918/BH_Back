import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';

export function CreateOwnerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new resource' }),
    ApiBody({
      type: CreateOwnerDto,
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

export function GetOwnerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all owners' }),
    ApiResponse({
      status: 200,
      example: {
        succes: true,
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

export function UpdateOwnerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Update owners Info ' }),
    ApiBody({
      type: UpdateOwnerDto,
      examples: {
        sample: {
          value: {
            username: 'sample',
            firstname: 'sampleFirst',
            lastname: 'sampleLast',
            email: 'sample.le@gmail.com',
            age: 12,
            address: 'sample brg xamp',
            phone_number: '123123123',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'The resource has been successfully updated.',
    }),
  );
}
