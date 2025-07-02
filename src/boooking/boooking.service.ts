import { Injectable } from '@nestjs/common';
import { CreateBoookingDto } from './dto/create-boooking.dto';
import { UpdateBoookingDto } from './dto/update-boooking.dto';

@Injectable()
export class BoookingService {
  create(createBoookingDto: CreateBoookingDto) {
    return 'This action adds a new boooking';
  }

  findAll() {
    return `This action returns all boooking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} boooking`;
  }

  update(id: number, updateBoookingDto: UpdateBoookingDto) {
    return `This action updates a #${id} boooking`;
  }

  remove(id: number) {
    return `This action removes a #${id} boooking`;
  }
}
