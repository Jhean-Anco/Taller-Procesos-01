import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../../../../application/services/auth.service';
import { LoginDto } from './dto/login.dto';
import { RespuestaLoginSwaggerDto } from './dto/respuesta-login.swagger.dto';
import { RespuestaLogoutSwaggerDto } from './dto/respuesta-logout.swagger.dto';
import { RespuestaSesionSwaggerDto } from './dto/respuesta-sesion.swagger.dto';
import { RutaPublica } from '../../../../../../shared/infrastructure/auth/ruta-publica.decorator';
import { UsuarioAutenticado } from '../../../../../../shared/infrastructure/auth/usuario-autenticado.interface';
import { RUTAS_API } from '../../../../../../shared/infrastructure/http/rutas-api.constantes';
import { ApiRespuestaOk } from '../../../../../../shared/infrastructure/http/swagger/api-respuesta.decorator';

type RequestConSesion = Request & {
  usuario?: UsuarioAutenticado;
  session?: {
    usuario?: UsuarioAutenticado;
    destroy(callback: (err?: unknown) => void): void;
  };
};

@Controller({
  path: RUTAS_API.auth.base,
  version: RUTAS_API.version,
})
@ApiTags('Autenticacion')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(RUTAS_API.auth.login)
  @RutaPublica()
  @ApiOperation({
    summary: 'Inicia sesion institucional',
    description:
      'Autentica al usuario, devuelve JWT y registra la sesion HTTP.',
  })
  @ApiBody({ type: LoginDto })
  @ApiRespuestaOk(
    RespuestaLoginSwaggerDto,
    'Autenticacion exitosa con token JWT y sesion HTTP.',
  )
  async login(
    @Body() body: LoginDto,
    @Req() request: RequestConSesion,
  ): Promise<{ accessToken: string; usuario: UsuarioAutenticado }> {
    const respuesta = await this.authService.login(body);

    // Si el cliente acepta cookies, además del JWT se deja una sesión HTTP activa.
    if (request.session) {
      request.session.usuario = respuesta.usuario;
    }

    return respuesta;
  }

  @Get(RUTAS_API.auth.sesion)
  @ApiOperation({
    summary: 'Obtiene la sesion activa',
    description:
      'Permite consultar el usuario autenticado via cookie de sesion o JWT.',
  })
  @ApiBearerAuth('jwt')
  @ApiCookieAuth('sesion')
  @ApiRespuestaOk(
    RespuestaSesionSwaggerDto,
    'Sesion autenticada recuperada correctamente.',
  )
  obtenerSesion(@Req() request: RequestConSesion): {
    usuario: UsuarioAutenticado;
  } {
    return {
      usuario: request.usuario!,
    };
  }

  @Post(RUTAS_API.auth.logout)
  @ApiOperation({
    summary: 'Cierra la sesion actual',
    description: 'Destruye la sesion HTTP actual y limpia la cookie.',
  })
  @ApiBearerAuth('jwt')
  @ApiCookieAuth('sesion')
  @ApiRespuestaOk(RespuestaLogoutSwaggerDto, 'Sesion cerrada correctamente.')
  async logout(
    @Req() request: RequestConSesion,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ ok: true }> {
    // El cierre de sesión destruye el estado del servidor antes de limpiar la cookie.
    await new Promise<void>((resolve) => {
      if (!request.session) {
        resolve();
        return;
      }

      request.session.destroy(() => resolve());
    });

    response.clearCookie('connect.sid');

    return { ok: true };
  }
}
