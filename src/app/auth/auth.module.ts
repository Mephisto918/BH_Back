import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserUnionService } from './userUnion.service';
import { CryptoService } from './utilities/crypto.service';
import { ImageModule } from 'src/infrastructure/image/image.module';
import { TenantsModule } from 'src/app/tenants/tenants.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './config/jwt.config';
import { AdminsModule } from 'src/app/admins/admins.module';
import { OwnersModule } from 'src/app/owners/owners.module';

@Module({
  imports: [
    ImageModule,
    TenantsModule,
    JwtModule.registerAsync(jwtConfig),
    AdminsModule,
    OwnersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserUnionService, CryptoService, JwtStrategy],
  exports: [UserUnionService, CryptoService],
})
export class AuthModule {}
