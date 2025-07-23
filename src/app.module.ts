import { AppController } from './app.controller';
import { DatabaseModule } from './infrastructure/database/database.module';
import { TenantsModule } from './domains/tenants/tenants.module';
import { ServeStaticModule } from '@nestjs/serve-static';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

import { join } from 'path';
import { AuthModule } from './domains/auth/auth.module';
import { OwnersModule } from './domains/owners/owners.module';
import { ImageModule } from './infrastructure/image/image.module';
import { AdminsModule } from './domains/admins/admins.module';
import { BoardingHousesModule } from './domains/boarding-houses/boarding-houses.module';
import { PdfModule } from './infrastructure/pdf/pdf.module';
import { LoggingMiddleware } from './forNowMiddleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BookingsModule } from './domains/bookings/bookings.module';
import { LocationModule } from './infrastructure/location/location.module';
import { RoomsModule } from './domains/rooms/rooms.module';

@Module({
  imports: [
    TenantsModule,
    DatabaseModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'media', 'public'),
      serveRoot: '/media/public',
    }),
    AuthModule,
    OwnersModule,
    ImageModule,
    AdminsModule,
    BoardingHousesModule,
    PdfModule,
    BookingsModule,
    LocationModule,
    RoomsModule,
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
