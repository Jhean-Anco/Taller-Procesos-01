import { INestApplication, VersioningType } from '@nestjs/common';
import type { Express } from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { RUTAS_API } from './shared/infrastructure/http/rutas-api.constantes';

export function configurarAplicacion(app: INestApplication): void {
  const appHttp: Express = app.getHttpAdapter().getInstance() as Express;
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
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 8,
      },
    }),
  );

  const corsOrigins = (
    process.env.CORS_ORIGINS ?? 'http://localhost:5173,http://127.0.0.1:5173'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.setGlobalPrefix(RUTAS_API.prefijo);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: RUTAS_API.version,
  });
}
