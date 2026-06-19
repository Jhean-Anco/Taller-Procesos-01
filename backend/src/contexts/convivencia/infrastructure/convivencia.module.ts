import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuloIa } from '../../ia/infrastructure/ia.module';
import { IaService } from '../../ia/application/services/ia.service';
import { ConvivenciaService } from '../application/services/convivencia.service';
import { REPOSITORIO_CONVIVENCIA } from '../application/ports/output/convivencia.repository';
import { ConvivenciaControlador } from './adapters/input/http/convivencia.controller';
import { RepositorioConvivenciaMemoria } from './persistence/in-memory/convivencia-memoria.repository';
import { AtencionManualOrmEntity } from './persistence/typeorm/entities/atencion-manual.orm-entity';
import { IncidenciaPsicologicaOrmEntity } from './persistence/typeorm/entities/incidencia-psicologica.orm-entity';
import { IntervencionOrmEntity } from './persistence/typeorm/entities/intervencion.orm-entity';
import { MaterialDocenteOrmEntity } from './persistence/typeorm/entities/material-docente.orm-entity';
import { ReporteAnonimoOrmEntity } from './persistence/typeorm/entities/reporte-anonimo.orm-entity';
import { UsuarioInstitucionalOrmEntity } from './persistence/typeorm/entities/usuario-institucional.orm-entity';
import { RepositorioConvivenciaTypeOrm } from './persistence/typeorm/repositories/typeorm-convivencia.repository';

@Global()
@Module({
  imports: [],
})
export class ModuloConvivencia {
  static registrar(): DynamicModule {
    const habilitado = process.env.DATABASE_ENABLED === 'true';

    return {
      module: ModuloConvivencia,
      imports: [
        ModuloIa.registrar(),
        ...(habilitado
          ? [
              TypeOrmModule.forFeature([
                UsuarioInstitucionalOrmEntity,
                ReporteAnonimoOrmEntity,
                IncidenciaPsicologicaOrmEntity,
                IntervencionOrmEntity,
                MaterialDocenteOrmEntity,
                AtencionManualOrmEntity,
              ]),
            ]
          : []),
      ],
      controllers: [ConvivenciaControlador],
      providers: [
        ...(habilitado
          ? [RepositorioConvivenciaTypeOrm]
          : [RepositorioConvivenciaMemoria]),
        {
          provide: REPOSITORIO_CONVIVENCIA,
          useExisting: habilitado
            ? RepositorioConvivenciaTypeOrm
            : RepositorioConvivenciaMemoria,
        },
        {
          provide: ConvivenciaService,
          useFactory: (
            repositorioConvivencia: unknown,
            iaService: IaService,
          ) => new ConvivenciaService(repositorioConvivencia as never, iaService as never),
          inject: [REPOSITORIO_CONVIVENCIA, IaService],
        },
      ],
      exports: [ConvivenciaService, REPOSITORIO_CONVIVENCIA],
    };
  }
}
