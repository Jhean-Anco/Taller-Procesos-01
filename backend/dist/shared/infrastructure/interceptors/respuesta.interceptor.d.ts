import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class RespuestaInterceptor<T> implements NestInterceptor<T, {
    ok: true;
    data: T;
    meta: {
        timestamp: string;
        path: string;
    };
}> {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<{
        ok: true;
        data: T;
        meta: {
            timestamp: string;
            path: string;
        };
    }>;
}
