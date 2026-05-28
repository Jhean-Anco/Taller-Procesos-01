import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class PublicReportRateLimitGuard implements CanActivate {
  private readonly attempts = new Map<string, number[]>();

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const ip = request.ip ?? request.socket.remoteAddress ?? 'unknown';
    const now = Date.now();
    const windowMs = Number(process.env.PUBLIC_REPORT_RATE_LIMIT_WINDOW_MS ?? 60000);
    const max = Number(process.env.PUBLIC_REPORT_RATE_LIMIT_MAX ?? 10);
    const recent = (this.attempts.get(ip) ?? []).filter((time) => now - time < windowMs);

    if (recent.length >= max) {
      throw new HttpException(
        'Demasiados reportes anonimos en poco tiempo',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    recent.push(now);
    this.attempts.set(ip, recent);
    return true;
  }
}
