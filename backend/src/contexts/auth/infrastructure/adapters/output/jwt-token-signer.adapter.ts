import { JwtService } from '@nestjs/jwt';
import { TokenSignerPort } from '../../../application/ports/output/token-signer.port';

export class JwtTokenSignerAdapter implements TokenSignerPort {
  constructor(private readonly jwtService: JwtService) {}

  sign(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
