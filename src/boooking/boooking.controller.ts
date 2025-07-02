import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoookingService } from './boooking.service';
import { CreateBoookingDto } from './dto/create-boooking.dto';
import { UpdateBoookingDto } from './dto/update-boooking.dto';

@Controller('boooking')
export class BoookingController {
  constructor(private readonly boookingService: BoookingService) {}

  @Post()
  create(@Body() createBoookingDto: CreateBoookingDto) {
    return this.boookingService.create(createBoookingDto);
  }

  @Get()
  findAll() {
    return this.boookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boookingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoookingDto: UpdateBoookingDto) {
    return this.boookingService.update(+id, updateBoookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boookingService.remove(+id);
  }
}
