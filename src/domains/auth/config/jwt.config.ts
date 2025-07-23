// src/auth/config/jwt.config.ts
import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';

export const jwtConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.JWT_SECRET_KEY,
    signOptions: { expiresIn: '1h' }, // or use another configService field
  }),
};
