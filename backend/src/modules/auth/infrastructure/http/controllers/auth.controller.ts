import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { RutaPublica } from '../../../../../shared/infrastructure/auth/ruta-publica.decorator';
import { UsuarioAutenticado } from '../../../../../shared/infrastructure/auth/usuario-autenticado.interface';
import { LoginDto } from '../../../application/dtos/auth.dtos';
import { AuthUseCases } from '../../../application/use-cases/auth.use-cases';

type RequestWithSession = Request & {
  usuario?: UsuarioAutenticado;
  session?: {
    usuario?: UsuarioAutenticado;
    destroy(callback: (err?: unknown) => void): void;
  };
};

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authUseCases: AuthUseCases) {}

  @Post('login')
  @RutaPublica()
  async login(@Body() dto: LoginDto, @Req() request: RequestWithSession) {
    const response = await this.authUseCases.login(dto, request.ip);
    if (request.session) {
      request.session.usuario = response.usuario;
    }
    return response;
  }

  @Get('me')
  me(@Req() request: RequestWithSession) {
    return this.authUseCases.current(request.usuario!);
  }

  @Get('sesion')
  session(@Req() request: RequestWithSession) {
    return this.authUseCases.current(request.usuario!);
  }

  @Post('logout')
  async logout(
    @Req() request: RequestWithSession,
    @Res({ passthrough: true }) response: Response,
  ) {
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
