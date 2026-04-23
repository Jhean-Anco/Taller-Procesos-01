import { INestApplication, VersioningType } from '@nestjs/common';
import type { Express } from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { RUTAS_API } from './shared/infrastructure/http/rutas-api.constantes';

export function configurarAplicacion(app: INestApplication): void {
  const appHttp: Express = app.getHttpAdapter().getInstance() as Express;
  // Se habilita trust proxy para que cookies y cabeceras funcionen correctamente detrás de un proxy reverso.
  appHttp.set('trust proxy', 1);
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? 'session-secret-dev',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 1000 * 60 * 60 * 8,
      },
    }),
  );
  // Todas las rutas quedan centralizadas bajo /api/v1 para mantener contrato uniforme.
  app.setGlobalPrefix(RUTAS_API.prefijo);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: RUTAS_API.version,
  });
}
