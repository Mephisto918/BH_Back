import { Test, TestingModule } from '@nestjs/testing';
import { BoookingService } from './boooking.service';

describe('BoookingService', () => {
  let service: BoookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoookingService],
    }).compile();

    service = module.get<BoookingService>(BoookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
