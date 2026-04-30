import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsuarioAutenticadoDto } from '../../../../aplicacion/dto/usuario-autenticado.dto';

export const UsuarioActual = createParamDecorator(
  (_data: unknown, contexto: ExecutionContext): UsuarioAutenticadoDto => {
    const solicitud = contexto.switchToHttp().getRequest();
    return solicitud.user as UsuarioAutenticadoDto;
  },
);
