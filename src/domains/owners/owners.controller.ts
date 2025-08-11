import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { OwnersService } from './owners.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { FindOwnersDto } from './dto/find-owners.dto';
import { CreateOwnerDoc, GetOwnerDoc, UpdateOwnerDoc } from './owners.swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { createMulterConfig } from 'src/infrastructure/shared/utils/multer-config.util';
import { UploadedFile } from '@nestjs/common';
import { PermitType } from '@prisma/client';

@Controller('owners')
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  @Get()
  @GetOwnerDoc()
  findAll(@Query() findAllOwnersDto: FindOwnersDto) {
    const results = this.ownersService.findAll(findAllOwnersDto);

    return results;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const results = this.ownersService.findOne(+id);
    return results;
  }

  @Post()
  @CreateOwnerDoc()
  create(@Body() createOwnerDto: CreateOwnerDto) {
    return this.ownersService.create(createOwnerDto);
  }

  @Post('permits')
  @UseInterceptors(FileInterceptor('file', createMulterConfig('pdf')))
  createPermit(
    @Body() payload: { id: number; type: PermitType; expiresAt: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.ownersService.createPermit(payload, file);
  }

  @Get(':id/permits')
  findPermits(@Param('id') id: string) {
    return this.ownersService.findPermits(+id);
  }
  @Delete('permits/:permitId')
  async deletePermit(
    @Param('id') ownerId: number,
    @Param('permitId') permitId: number,
  ) {
    return this.ownersService.removePermit(+permitId);
  }

  @Patch(':id')
  @UpdateOwnerDoc()
  update(@Param('id') id: string, @Body() updateOwnerDto: UpdateOwnerDto) {
    const results = this.ownersService.update(+id, updateOwnerDto);
    return results;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const results = this.ownersService.remove(+id);
    return results;
  }
}
