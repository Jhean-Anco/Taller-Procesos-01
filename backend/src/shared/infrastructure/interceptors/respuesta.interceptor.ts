import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class RespuestaInterceptor<T> implements NestInterceptor<
  T,
  { ok: true; data: T; meta: { timestamp: string; path: string } }
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<{
    ok: true;
    data: T;
    meta: { timestamp: string; path: string };
  }> {
    const request = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      map((data) => ({
        ok: true as const,
        data,
        meta: {
          timestamp: new Date().toISOString(),
          path: request.url,
        },
      })),
    );
  }
}
