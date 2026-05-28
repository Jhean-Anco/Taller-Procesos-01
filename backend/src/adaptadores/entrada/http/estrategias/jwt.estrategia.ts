import { Injectable } from '@nestjs/common';
import { UsuarioAutenticadoDto } from '../../../../aplicacion/dto/usuario-autenticado.dto';

@Injectable()
export class JwtEstrategia {
  validate(payload: {
    sub?: string;
    id?: string;
    nombreUsuario?: string;
    nombre?: string;
    rol: UsuarioAutenticadoDto['rol'];
    estudianteId?: string | null;
  }): UsuarioAutenticadoDto {
    return {
      usuarioId: payload.sub ?? payload.id ?? '',
      nombreUsuario: payload.nombreUsuario ?? payload.nombre ?? '',
      rol: payload.rol,
      estudianteId: payload.estudianteId ?? null,
    };
  }
}
