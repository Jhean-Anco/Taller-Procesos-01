import { Module } from '@nestjs/common';
import { PUERTO_VERIFICACION_SALUD } from '../application/ports/output/verificacion-salud.port';
import { SaludService } from '../application/services/salud.service';
import { SaludControlador } from './adapters/input/http/salud.controller';
import { AdaptadorSaludSistema } from './adapters/output/salud-sistema.adapter';

@Module({
  imports: [],
  controllers: [SaludControlador],
  providers: [
    AdaptadorSaludSistema,
    {
      provide: PUERTO_VERIFICACION_SALUD,
      useExisting: AdaptadorSaludSistema,
    },
    {
      provide: SaludService,
      useFactory: (puertoVerificacionSalud: unknown) =>
        new SaludService(puertoVerificacionSalud as never),
      inject: [PUERTO_VERIFICACION_SALUD],
    },
  ],
})
export class ModuloSalud {}
