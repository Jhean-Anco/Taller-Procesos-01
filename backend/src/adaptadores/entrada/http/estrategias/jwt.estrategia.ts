import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuarioAutenticadoDto } from '../../../../aplicacion/dto/usuario-autenticado.dto';

interface PayloadJwt {
  sub: string;
  nombreUsuario: string;
  rol: UsuarioAutenticadoDto['rol'];
  estudianteId: string | null;
}

@Injectable()
export class JwtEstrategia extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRETO') ??
        'clave_super_segura_cambiar_en_produccion',
    });
  }

  validate(payload: PayloadJwt): UsuarioAutenticadoDto {
    return {
      usuarioId: payload.sub,
      nombreUsuario: payload.nombreUsuario,
      rol: payload.rol,
      estudianteId: payload.estudianteId,
    };
  }
}
