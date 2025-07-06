import { AppController } from './app.controller';
import { DatabaseModule } from './infrastructure/database/database.module';
import { TenantsModule } from './tenants/tenants.module';
import { ServeStaticModule } from '@nestjs/serve-static';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { OwnersModule } from './owners/owners.module';
import { ImageModule } from './infrastructure/image/image.module';
import { AdminsModule } from './admins/admins.module';
import { BoardingHousesModule } from './boarding-houses/boarding-houses.module';
import { BoookingModule } from './boooking/boooking.module';
import { PdfModule } from './infrastructure/pdf/pdf.module';
import { LoggingMiddleware } from './forNowMiddleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

@Module({
  imports: [
    TenantsModule,
    DatabaseModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'media'),
      serveRoot: '/media',
    }),
    AuthModule,
    OwnersModule,
    ImageModule,
    AdminsModule,
    BoardingHousesModule,
    BoookingModule,
    PdfModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*'); // apply to all routes
  }
}

// export class AppModule(){

// }
