import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import { UsuarioAutenticado } from '../../../../shared/infrastructure/auth/usuario-autenticado.interface';
import { TokenSignerPort } from '../../application/ports/token-signer.port';

@Injectable()
export class JwtTokenSignerAdapter implements TokenSignerPort {
  constructor(private readonly jwtService: JwtService) {}

  sign(user: UsuarioAutenticado): Promise<string> {
    return this.jwtService.signAsync({
      sub: user.id,
      correo: user.correo,
      nombre: user.nombre,
      rol: user.rol,
      jti: randomUUID(),
      tokenVersion: (user as { tokenVersion?: number }).tokenVersion ?? 0,
    });
  }
}
