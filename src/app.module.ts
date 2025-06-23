import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './common/database/database.module';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { TenantsModule } from './tenants/tenants.module';
import { ServeStaticModule } from '@nestjs/serve-static';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { OwnersModule } from './owners/owners.module';

@Module({
  imports: [
    TenantsModule,
    ConfigModule,
    DatabaseModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'media'),
      serveRoot: '/media',
    }),
    AuthModule,
    OwnersModule,
  ],
  controllers: [AppController],
  providers: [
    ConfigService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
