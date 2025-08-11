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
import { DocumentModule } from './infrastructure/document/document.module';
import { LoggingMiddleware } from './forNowMiddleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BookingsModule } from './domains/bookings/bookings.module';
import { LocationModule } from './infrastructure/location/location.module';
import { RoomsModule } from './domains/rooms/rooms.module';
import { SharedModule } from './infrastructure/shared/shared.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { MaintenanceModule } from './infrastructure/maintenance/maintenance.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule,
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          rootPath: join(__dirname, '..', configService.mediaPaths.public),
          serveRoot: configService.mediaPaths.public,
        },
      ],
    }),
    ScheduleModule.forRoot(),
    MaintenanceModule,
    TenantsModule,
    DatabaseModule,
    AuthModule,
    OwnersModule,
    ImageModule,
    AdminsModule,
    BoardingHousesModule,
    DocumentModule,
    BookingsModule,
    LocationModule,
    RoomsModule,
    SharedModule,
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
