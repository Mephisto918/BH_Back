import { Injectable } from '@nestjs/common';
import { join } from 'path';
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

  get mediaPaths() {
    const baseDir = this.configService.get<string>('MEDIA_DIR_PATH') || 'media';
    return {
      public: join(baseDir, 'public'),
      protected: join(baseDir, 'protected'),
    };
  }
}
