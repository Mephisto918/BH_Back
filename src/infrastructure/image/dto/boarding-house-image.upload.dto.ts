import { ApiProperty } from '@nestjs/swagger';

export class BoardingHouseImageUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    required: false,
  })
  thumbnail?: Express.Multer.File[];

  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    required: false,
  })
  main?: Express.Multer.File[];

  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    required: false,
  })
  gallery?: Express.Multer.File[];

  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    required: false,
  })
  banner?: Express.Multer.File[];

  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    required: false,
  })
  floorplan?: Express.Multer.File[];
}
