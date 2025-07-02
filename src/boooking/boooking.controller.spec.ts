import { Test, TestingModule } from '@nestjs/testing';
import { BoookingController } from './boooking.controller';
import { BoookingService } from './boooking.service';

describe('BoookingController', () => {
  let controller: BoookingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoookingController],
      providers: [BoookingService],
    }).compile();

    controller = module.get<BoookingController>(BoookingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
