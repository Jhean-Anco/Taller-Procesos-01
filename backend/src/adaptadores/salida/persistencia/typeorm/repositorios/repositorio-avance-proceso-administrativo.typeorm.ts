import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepositorioAvanceProcesoAdministrativoPuerto } from '../../../../../aplicacion/puertos/salida/repositorio-avance-proceso-administrativo.puerto';
import { AvanceProcesoAdministrativoEntidad } from '../../../../../dominio/entidades/avance-proceso-administrativo.entidad';
import { AvanceProcesoAdministrativoOrmEntidad } from '../entidades/avance-proceso-administrativo.orm-entidad';
import { AvanceProcesoAdministrativoMapeador } from '../mapeadores/avance-proceso-administrativo.mapeador';

@Injectable()
export class RepositorioAvanceProcesoAdministrativoTypeorm
  implements RepositorioAvanceProcesoAdministrativoPuerto
{
  constructor(
    @InjectRepository(AvanceProcesoAdministrativoOrmEntidad)
    private readonly repositorio: Repository<AvanceProcesoAdministrativoOrmEntidad>,
  ) {}

  async guardar(
    avance: AvanceProcesoAdministrativoEntidad,
  ): Promise<AvanceProcesoAdministrativoEntidad> {
    const guardado = await this.repositorio.save(
      this.repositorio.create(
        AvanceProcesoAdministrativoMapeador.aPersistencia(avance),
      ),
    );
    return AvanceProcesoAdministrativoMapeador.aDominio(guardado);
  }

  async listarPorProceso(
    procesoAdministrativoId: string,
  ): Promise<AvanceProcesoAdministrativoEntidad[]> {
    const avances = await this.repositorio.find({
      where: { procesoAdministrativoId },
      order: { fechaCreacion: 'DESC' },
    });
    return avances.map(AvanceProcesoAdministrativoMapeador.aDominio);
  }

  contar(): Promise<number> {
    return this.repositorio.count();
  }
}
