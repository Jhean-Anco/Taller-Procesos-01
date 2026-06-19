import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ActivitiesModule } from './modules/activities/activities.module';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ReportsModule } from './modules/reports/reports.module';
import { UsersModule } from './modules/users/users.module';
import { ModuloSalud } from './contexts/salud/infrastructure/salud.module';
import { GuardiaAutenticacion } from './shared/infrastructure/auth/autenticacion.guard';
import { GuardiaRoles } from './shared/infrastructure/auth/guardia-roles.guard';
import { ModuloBaseDatos } from './shared/infrastructure/database/base-datos.module';
import { validarEntorno } from './shared/infrastructure/config/validar-entorno';
import { RespuestaInterceptor } from './shared/infrastructure/interceptors/respuesta.interceptor';
import { TuberiaRecortarCadenas } from './shared/infrastructure/pipes/recortar-cadenas.pipe';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
      validate: validarEntorno,
    }),
    ModuloBaseDatos.registrar(),
    AuthModule,
    UsersModule,
    ReportsModule,
    ActivitiesModule,
    DashboardModule,
    ModuloSalud,
  ],
  providers: [
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
    {
      provide: APP_GUARD,
      useClass: GuardiaAutenticacion,
    },
    {
      provide: APP_GUARD,
      useClass: GuardiaRoles,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RespuestaInterceptor,
    },
  ],
})
export class AplicacionModule {}
