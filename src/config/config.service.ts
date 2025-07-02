import { Injectable } from '@nestjs/common';
// * using aliases for naming
import { ConfigService as ConfigurationService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: ConfigurationService) {}

  get DATABASE_URL() {
    return this.configService.get<string>('DATABASE_URL');
  }

  get PORT() {
    return this.configService.get<number>('PORT');
  }

  get ENVIRONMENT() {
    return this.configService.get<string>('ENVIRONMENT');
  }

  get SECRET_KEY() {
    return this.configService.get<string>('SECRET_KEY');
  }

  get JWT_SECRET_KEY() {
    return this.configService.get<string>('JWT_SECRET_KEY');
  }
}
