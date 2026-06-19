import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuditService } from './../../../../audit/application/use-cases/audit.service';
import { RutaPublica } from '../../../../../shared/infrastructure/auth/ruta-publica.decorator';
import { UsuarioAutenticado } from '../../../../../shared/infrastructure/auth/usuario-autenticado.interface';
import { LoginDto } from '../../../application/dtos/auth.dtos';
import { AuthUseCases } from '../../../application/use-cases/auth.use-cases';

type RequestWithSession = Request & {
  usuario?: UsuarioAutenticado;
  session?: {
    usuario?: UsuarioAutenticado;
    regenerate(callback: (err?: unknown) => void): void;
    destroy(callback: (err?: unknown) => void): void;
  };
};

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authUseCases: AuthUseCases,
    private readonly auditService: AuditService,
  ) {}

  @Post('login')
  @RutaPublica()
  async login(@Body() dto: LoginDto, @Req() request: RequestWithSession) {
    try {
      const response = await this.authUseCases.login(dto, request.ip);
      if (request.session) {
        await new Promise<void>((resolve, reject) => {
          request.session!.regenerate((error) => {
            if (error) {
              reject(error);
              return;
            }
            request.session!.usuario = response.usuario;
            resolve();
          });
        });
      }
      return response;
    } catch (error) {
      await this.auditService.register({
        action: 'LOGIN_FAILED',
        entityType: 'user',
        entityId: dto.email ?? dto.correo ?? 'unknown',
        ip: request.ip,
      });
      throw error;
    }
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
    response.clearCookie('safeschool.sid');
    await this.auditService.register({
      actorUserId: request.usuario?.id ?? null,
      action: 'LOGOUT',
      entityType: 'user',
      entityId: request.usuario?.id ?? null,
      ip: request.ip,
    });
    return { ok: true };
  }
}
