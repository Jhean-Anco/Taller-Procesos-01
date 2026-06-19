import { INestApplication, VersioningType } from '@nestjs/common';
import type { Express, NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { randomUUID } from 'node:crypto';
import { RUTAS_API } from './shared/infrastructure/http/rutas-api.constantes';

export function configurarAplicacion(app: INestApplication): void {
  const appHttp: Express = app.getHttpAdapter().getInstance() as Express;
  const esTest = process.env.NODE_ENV === 'test';
  appHttp.set('trust proxy', 1);
  app.use(cookieParser());
  app.use((_: Request, response: Response, next: NextFunction) => {
    response.setHeader('X-Request-Id', randomUUID());
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('Referrer-Policy', 'no-referrer');
    response.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    response.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self';",
    );
    next();
  });
  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? (esTest ? 'test-session-secret' : ''),
      resave: false,
      saveUninitialized: false,
      name: 'safeschool.sid',
      cookie: {
        httpOnly: true,
        sameSite: 'strict',
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
