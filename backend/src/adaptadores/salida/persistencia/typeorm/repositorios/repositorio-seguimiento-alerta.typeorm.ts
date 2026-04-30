import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepositorioSeguimientoAlertaPuerto } from '../../../../../aplicacion/puertos/salida/repositorio-seguimiento-alerta.puerto';
import { SeguimientoAlertaEntidad } from '../../../../../dominio/entidades/seguimiento-alerta.entidad';
import { SeguimientoAlertaOrmEntidad } from '../entidades/seguimiento-alerta.orm-entidad';
import { SeguimientoAlertaMapeador } from '../mapeadores/seguimiento-alerta.mapeador';

@Injectable()
export class RepositorioSeguimientoAlertaTypeorm
  implements RepositorioSeguimientoAlertaPuerto
{
  constructor(
    @InjectRepository(SeguimientoAlertaOrmEntidad)
    private readonly repositorio: Repository<SeguimientoAlertaOrmEntidad>,
  ) {}

  async guardar(
    seguimiento: SeguimientoAlertaEntidad,
  ): Promise<SeguimientoAlertaEntidad> {
    const guardado = await this.repositorio.save(
      this.repositorio.create(
        SeguimientoAlertaMapeador.aPersistencia(seguimiento),
      ),
    );
    return SeguimientoAlertaMapeador.aDominio(guardado);
  }

  async listarPorAlerta(alertaId: string): Promise<SeguimientoAlertaEntidad[]> {
    const seguimientos = await this.repositorio.find({
      where: { alertaId },
      order: { fechaCreacion: 'DESC' },
    });
    return seguimientos.map(SeguimientoAlertaMapeador.aDominio);
  }
}
