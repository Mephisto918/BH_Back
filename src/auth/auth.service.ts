import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserUnionService } from './userUnion.service';
import { CryptoService } from './utilities/crypto.service';
import { JwtService } from '@nestjs/jwt'; // ** not a custom Service but built in

@Injectable()
export class AuthService {
  constructor(
    private readonly userUnionService: UserUnionService,
    private readonly cryptoService: CryptoService,
    private readonly jtwService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const result = await this.userUnionService.findUserByUsername(username);

    if (!result) {
      throw new UnauthorizedException('User not found');
    }

    const { user, type } = result;

    // const isPasswordValid = await this
    // TODO: implement password validation helper
    // * use cryptoService for comparing hashed and normal password
    if (!(user.password === password)) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      type,
      user,
    };
  }

  async login(username: string, password: string) {
    const validated = await this.validateUser(username, password);

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const { password: pswd, ...filter } = validated.user;
    // * filtering area
    // * more filtering to be done
    /*
     *  "id": 1,
     *  "username": "startlord",
     *  "email": "star@lord.com",
     *  "role": "TENANT",
     *  "isActive": true,
     *  "isVerified": false,
     */
    // * current shape of the response are bellow
    /*
     * "id": 1,
     * "username": "startlord",
     * "firstname": "StarUpdated",
     * "lastname": "LordUpdated",
     * "email": "star@lord.com",
     * "role": "TENANT",
     * "isActive": true,
     * "isVerified": false,
     * "createdAt": "2025-06-09T15:56:46.899Z",
     * "updatedAt": "2025-06-23T12:54:27.694Z",
     * "age": 23,
     * "guardian": "Guardians Of the GALAXY",
     * "address": "Egos home",
     * "phone_number": "092313231231"
     */

    const payload = {
      userId: validated.user.id,
      username: validated.user.username,
      role: validated.user.role,
      type: validated.type,
    };

    return {
      access_token: this.jtwService.sign(payload),
      // access_token: this.jtwService.(payload),
      user: filter,
    };
  }
}

// TODO: Finish below
/*
 *
 * ### Controller
 * - POST /login
 * - POST  /register
 * - POST /refresh
 * - POST /logout
 * - POST /2fa/verify (optional if using 2FA)
 * - POST /password/reset-request
 * - POST /password/reset
 * 		`Keep controller logic very thin, just forwarding to the service`
 *
 * ### Services
 * - `validateUser(email, password)`
 * - `login(user)`
 * - `register(userDTO)`
 * - `refreshToken(oldToken)`
 * - `logout(user)`
 * - `requestPasswordReset(email)`
 * - `resetPassword(token, newPassword)`
 * - `verify2FA(....)`
 *
 * ### Guards
 * - `JwtAuthGuard`
 * - `RolesGuard(for RBAC)`
 * - `TwoFactorGuard (optional if you want 2FA inforcement)`
 *
 * ### Strategies (if using @nestjs/passport)
 * 	Used to plug into Nest's AuthGuard system
 * - JwtStrategy
 * - LocalStrategy (for username/password login)
 *
 * ### DTO's (Data Transfer Objects)
 * 	Keeps request validation and typing consistent
 * - LoginDto
 * - RegisterDto
 * - RefreshTokenDto
 * - ResetPasswordDto
 * - RequestRestDto
 *
 * ### Interfaces / Contracts
 * - IAuthPayload
 * - IJwtPayload
 * - IUserFromRequest
 *
 * ### Tokens / Helpers / Utilities
 * 	You can extract this to shared libs or keep them inside auth.utils
 * 	These help decouple things like signToken(), verifyToken(), generate2FASecret() from the service logic
 * - jwt.helper.ts
 * - hash.helper.ts
 * - 2fa.helper.ts
 *
 * ### Middlewares (optional)
 * 	if you want token parsing or ealr user cheks before guards
 */
