import { Module } from '@nestjs/common';
import { PUERTO_VERIFICACION_SALUD } from '../application/ports/output/verificacion-salud.port';
import { SaludService } from '../application/services/salud.service';
import { SaludControlador } from './adapters/input/http/salud.controller';
import { AdaptadorSaludSistema } from './adapters/output/salud-sistema.adapter';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [SaludControlador],
  providers: [
    SaludService,
    AdaptadorSaludSistema,
    {
      provide: PUERTO_VERIFICACION_SALUD,
      useExisting: AdaptadorSaludSistema,
    },
  ],
})
export class ModuloSalud {}
