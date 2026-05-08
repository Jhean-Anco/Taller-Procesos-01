import { Module } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ModuloAuth } from './contexts/auth/infrastructure/auth.module';
import { ModuloIa } from './contexts/ia/infrastructure/ia.module';
import { ModuloConvivencia } from './contexts/convivencia/infrastructure/convivencia.module';
import { ModuloSalud } from './contexts/salud/infrastructure/salud.module';
import { GuardiaAutenticacion } from './shared/infrastructure/auth/autenticacion.guard';
import { GuardiaRoles } from './shared/infrastructure/auth/guardia-roles.guard';
import { ModuloBaseDatos } from './shared/infrastructure/database/base-datos.module';
import { validarEntorno } from './shared/infrastructure/config/validar-entorno';
import { RespuestaInterceptor } from './shared/infrastructure/interceptors/respuesta.interceptor';
import { TuberiaRecortarCadenas } from './shared/infrastructure/pipes/recortar-cadenas.pipe';

@Module({
  imports: [
    // La configuración se carga una sola vez y se valida al arrancar la aplicación.
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
      validate: validarEntorno,
    }),
    ModuloAuth,
    ModuloBaseDatos.registrar(),
    ModuloSalud,
    ModuloIa.registrar(),
    ModuloConvivencia.registrar(),
  ],
  providers: [
    // Primero se normalizan cadenas de entrada y luego se aplica validación estricta.
    {
      provide: APP_PIPE,
      useClass: TuberiaRecortarCadenas,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    },
    // La autenticación se ejecuta antes que la autorización por roles.
    {
      provide: APP_GUARD,
      useClass: GuardiaAutenticacion,
    },
    {
      provide: APP_GUARD,
      useClass: GuardiaRoles,
    },
    // Todas las respuestas HTTP pasan por un formato uniforme ok/data/meta.
    {
      provide: APP_INTERCEPTOR,
      useClass: RespuestaInterceptor,
    },
  ],
})
export class AplicacionModule {}
