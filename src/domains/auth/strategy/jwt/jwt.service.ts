import { Injectable } from '@nestjs/common';

// TODO: soon for added features
@Injectable()
export class JwtService {
  private revokedTokens = new Set<string>();

  revoke(token: string) {
    this.revokedTokens.add(token);
  }

  isRevoked(token: string) {
    return this.revokedTokens.has(token);
  }
}
