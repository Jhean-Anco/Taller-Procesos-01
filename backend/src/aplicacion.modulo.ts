import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InyeccionDependenciasModulo } from './configuracion/inyeccion-dependencias.modulo';
import { obtenerConfiguracionBaseDatos } from './configuracion/base-datos.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: obtenerConfiguracionBaseDatos,
    }),
    InyeccionDependenciasModulo,
  ],
})
export class AplicacionModulo {}
