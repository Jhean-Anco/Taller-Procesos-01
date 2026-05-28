import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioAutenticado } from '../../../../shared/infrastructure/auth/usuario-autenticado.interface';
import { TokenSignerPort } from '../../application/ports/token-signer.port';

@Injectable()
export class JwtTokenSignerAdapter implements TokenSignerPort {
  constructor(private readonly jwtService: JwtService) {}

  sign(user: UsuarioAutenticado): Promise<string> {
    return this.jwtService.signAsync(user);
  }
}
