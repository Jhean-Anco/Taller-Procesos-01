import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>;
      user?: unknown;
      usuario?: {
        id?: string;
        nombre?: string;
        rol?: string;
      };
    }>();

    if (request.usuario) {
      request.user = {
        usuarioId: request.usuario.id,
        nombreUsuario: request.usuario.nombre,
        rol: request.usuario.rol,
        estudianteId: null,
      };
      return true;
    }

    const authorization = request.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token JWT requerido');
    }

    const payload = this.jwtService.verify<Record<string, unknown>>(
      authorization.replace('Bearer ', '').trim(),
    );
    request.user = {
      usuarioId: String(payload.sub ?? payload.id ?? ''),
      nombreUsuario: String(payload.nombreUsuario ?? payload.nombre ?? ''),
      rol: String(payload.rol ?? ''),
      estudianteId: payload.estudianteId ?? null,
    };
    return true;
  }
}
