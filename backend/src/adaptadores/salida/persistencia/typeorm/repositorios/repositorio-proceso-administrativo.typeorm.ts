import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepositorioProcesoAdministrativoPuerto } from '../../../../../aplicacion/puertos/salida/repositorio-proceso-administrativo.puerto';
import { ProcesoAdministrativoEntidad } from '../../../../../dominio/entidades/proceso-administrativo.entidad';
import { ProcesoAdministrativoOrmEntidad } from '../entidades/proceso-administrativo.orm-entidad';
import { ProcesoAdministrativoMapeador } from '../mapeadores/proceso-administrativo.mapeador';

@Injectable()
export class RepositorioProcesoAdministrativoTypeorm
  implements RepositorioProcesoAdministrativoPuerto
{
  constructor(
    @InjectRepository(ProcesoAdministrativoOrmEntidad)
    private readonly repositorio: Repository<ProcesoAdministrativoOrmEntidad>,
  ) {}

  async guardar(
    proceso: ProcesoAdministrativoEntidad,
  ): Promise<ProcesoAdministrativoEntidad> {
    const guardado = await this.repositorio.save(
      this.repositorio.create(ProcesoAdministrativoMapeador.aPersistencia(proceso)),
    );
    return ProcesoAdministrativoMapeador.aDominio(guardado);
  }

  async obtenerPorId(id: string): Promise<ProcesoAdministrativoEntidad | null> {
    const proceso = await this.repositorio.findOneBy({ id });
    return proceso ? ProcesoAdministrativoMapeador.aDominio(proceso) : null;
  }

  async listarPorAlerta(alertaId: string): Promise<ProcesoAdministrativoEntidad[]> {
    const procesos = await this.repositorio.find({
      where: { alertaId },
      order: { fechaCreacion: 'DESC' },
    });
    return procesos.map(ProcesoAdministrativoMapeador.aDominio);
  }

  contar(): Promise<number> {
    return this.repositorio.count();
  }

  contarPorEstado(
    estado: ProcesoAdministrativoEntidad['estado'],
  ): Promise<number> {
    return this.repositorio.countBy({ estado });
  }
}
