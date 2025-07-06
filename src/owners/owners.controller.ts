import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OwnersService } from './owners.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { FindOwnersDto } from './dto/find-owners.dto';
import { CreateOwnerDoc, GetOwnerDoc, UpdateOwnerDoc } from './owners.swagger';

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
