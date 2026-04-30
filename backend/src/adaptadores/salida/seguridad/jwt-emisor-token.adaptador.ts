import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioAutenticadoDto } from '../../../aplicacion/dto/usuario-autenticado.dto';
import { EmisorTokenPuerto } from '../../../aplicacion/puertos/salida/emisor-token.puerto';

@Injectable()
export class JwtEmisorTokenAdaptador implements EmisorTokenPuerto {
  constructor(private readonly jwtService: JwtService) {}

  emitirTokenAcceso(payload: UsuarioAutenticadoDto): Promise<string> {
    return this.jwtService.signAsync({
      sub: payload.usuarioId,
      nombreUsuario: payload.nombreUsuario,
      rol: payload.rol,
      estudianteId: payload.estudianteId,
    });
  }
}
