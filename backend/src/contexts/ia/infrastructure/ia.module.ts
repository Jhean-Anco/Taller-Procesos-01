import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IaService } from '../application/services/ia.service';
import { PUERTO_PROVEEDOR_IA } from '../application/ports/output/proveedor-ia.port';
import { REPOSITORIO_REGISTRO_SOLICITUD } from '../application/ports/output/registro-solicitud.repository';
import { IaControlador } from './adapters/input/http/ia.controller';
import { AdaptadorClienteOpenAi } from './adapters/output/cliente-openai.adapter';
import { RepositorioRegistroSolicitudMemoria } from './persistence/in-memory/registro-solicitud-memoria.repository';
import { RegistroSolicitudOrmEntidad } from './persistence/typeorm/entities/registro-solicitud.orm-entidad';
import { RepositorioRegistroSolicitudTypeOrm } from './persistence/typeorm/repositories/typeorm-registro-solicitud.repository';

@Global()
@Module({
  imports: [],
})
export class ModuloIa {
  static registrar(): DynamicModule {
    const habilitado = process.env.DATABASE_ENABLED === 'true';

    return {
      module: ModuloIa,
      // El almacenamiento de trazas de IA también cambia entre memoria y base de datos.
      imports: habilitado
        ? [TypeOrmModule.forFeature([RegistroSolicitudOrmEntidad])]
        : [],
      controllers: [IaControlador],
      providers: [
        IaService,
        AdaptadorClienteOpenAi,
        ...(habilitado
          ? [RepositorioRegistroSolicitudTypeOrm]
          : [RepositorioRegistroSolicitudMemoria]),
        // El servicio de aplicación solo conoce puertos, no adaptadores concretos.
        {
          provide: PUERTO_PROVEEDOR_IA,
          useExisting: AdaptadorClienteOpenAi,
        },
        {
          provide: REPOSITORIO_REGISTRO_SOLICITUD,
          useExisting: habilitado
            ? RepositorioRegistroSolicitudTypeOrm
            : RepositorioRegistroSolicitudMemoria,
        },
      ],
      exports: [IaService],
    };
  }
}
