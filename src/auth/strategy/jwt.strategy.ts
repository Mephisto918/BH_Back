import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from 'src/config/config.service';

type JwtPayload = {
  userId: string;
  username: string;
  role: string;
  type: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // * this might throw undeifined
      secretOrKey: configService.JWT_SECRET_KEY!,
    });
  }

  validate(payload: JwtPayload) {
    // for req.user
    return {
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
      type: payload.type,
    };
  }
}
