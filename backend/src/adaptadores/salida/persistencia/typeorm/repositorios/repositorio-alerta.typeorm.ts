import { FiltroAlertasDto } from '../../../../../aplicacion/dto/filtro-alertas.dto';
import { HistoriaAlertaDto } from '../../../../../aplicacion/dto/historia-alerta.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepositorioAlertaPuerto } from '../../../../../aplicacion/puertos/salida/repositorio-alerta.puerto';
import { AlertaEntidad, EstadoAlerta } from '../../../../../dominio/entidades/alerta.entidad';
import { AlertaOrmEntidad } from '../entidades/alerta.orm-entidad';
import { AlertaMapeador } from '../mapeadores/alerta.mapeador';

@Injectable()
export class RepositorioAlertaTypeorm implements RepositorioAlertaPuerto {
  constructor(
    @InjectRepository(AlertaOrmEntidad)
    private readonly repositorio: Repository<AlertaOrmEntidad>,
  ) {}

  async guardar(alerta: AlertaEntidad): Promise<AlertaEntidad> {
    const guardado = await this.repositorio.save(
      this.repositorio.create(AlertaMapeador.aPersistencia(alerta)),
    );
    return AlertaMapeador.aDominio(guardado);
  }

  async listar(filtros?: FiltroAlertasDto): Promise<AlertaEntidad[]> {
    const consulta = this.repositorio.createQueryBuilder('alerta');

    if (filtros?.estado) {
      consulta.andWhere('alerta.estado = :estado', { estado: filtros.estado });
    }
    if (typeof filtros?.riesgoMinimo === 'number') {
      consulta.andWhere('alerta.puntajeRiesgo >= :riesgoMinimo', {
        riesgoMinimo: filtros.riesgoMinimo,
      });
    }
    if (typeof filtros?.riesgoMaximo === 'number') {
      consulta.andWhere('alerta.puntajeRiesgo <= :riesgoMaximo', {
        riesgoMaximo: filtros.riesgoMaximo,
      });
    }
    if (filtros?.fechaDesde) {
      consulta.andWhere('alerta.fechaCreacion >= :fechaDesde', {
        fechaDesde: filtros.fechaDesde,
      });
    }
    if (filtros?.fechaHasta) {
      consulta.andWhere('alerta.fechaCreacion <= :fechaHasta', {
        fechaHasta: filtros.fechaHasta,
      });
    }

    const alertas = await consulta.orderBy('alerta.fechaCreacion', 'DESC').getMany();
    return alertas.map(AlertaMapeador.aDominio);
  }

  async obtenerPorId(id: string): Promise<AlertaEntidad | null> {
    const alerta = await this.repositorio.findOneBy({ id });
    return alerta ? AlertaMapeador.aDominio(alerta) : null;
  }

  async obtenerHistoriaPorId(id: string): Promise<HistoriaAlertaDto | null> {
    const alerta = await this.repositorio.findOne({
      where: { id },
      relations: {
        encuesta: true,
        seguimientos: true,
        procesosAdministrativos: { avances: true },
      },
    });

    if (!alerta) {
      return null;
    }

    return {
      alerta: {
        id: alerta.id,
        estudianteId: alerta.estudianteId,
        encuestaId: alerta.encuestaId,
        puntajeRiesgo: alerta.puntajeRiesgo,
        estado: alerta.estado as HistoriaAlertaDto['alerta']['estado'],
        psicologoAsignadoId: alerta.psicologoAsignadoId,
        fechaCreacion: alerta.fechaCreacion,
        ultimaActualizacion: alerta.ultimaActualizacion,
      },
      encuesta: {
        textoEmocional: alerta.encuesta.textoEmocional,
        nivelAnimo: alerta.encuesta.nivelAnimo,
        nivelSeguridad: alerta.encuesta.nivelSeguridad,
        fechaCreacion: alerta.encuesta.fechaCreacion,
      },
      seguimientos: alerta.seguimientos
        .sort(
          (a, b) =>
            new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime(),
        )
        .map((seguimiento) => ({
          id: seguimiento.id,
          psicologoId: seguimiento.psicologoId,
          accionGlobal: seguimiento.accionGlobal,
          descripcion: seguimiento.descripcion,
          fechaCreacion: seguimiento.fechaCreacion,
        })),
      procesosAdministrativos: alerta.procesosAdministrativos
        .sort(
          (a, b) =>
            new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime(),
        )
        .map((proceso) => ({
          id: proceso.id,
          administrativoId: proceso.administrativoId,
          accionInstitucional: proceso.accionInstitucional,
          descripcionInicial: proceso.descripcionInicial,
          responsable: proceso.responsable,
          fechaObjetivo: proceso.fechaObjetivo,
          estado: proceso.estado as HistoriaAlertaDto['procesosAdministrativos'][number]['estado'],
          fechaCreacion: proceso.fechaCreacion,
          fechaActualizacion: proceso.fechaActualizacion,
          avances: (proceso.avances ?? [])
            .sort(
              (a, b) =>
                new Date(b.fechaCreacion).getTime() -
                new Date(a.fechaCreacion).getTime(),
            )
            .map((avance) => ({
              id: avance.id,
              administrativoId: avance.administrativoId,
              descripcionAvance: avance.descripcionAvance,
              tipo: avance.tipo as HistoriaAlertaDto['procesosAdministrativos'][number]['avances'][number]['tipo'],
              estado: avance.estado as HistoriaAlertaDto['procesosAdministrativos'][number]['avances'][number]['estado'],
              fechaCreacion: avance.fechaCreacion,
            })),
        })),
    };
  }

  contar(): Promise<number> {
    return this.repositorio.count();
  }

  contarPorEstado(estado: EstadoAlerta): Promise<number> {
    return this.repositorio.countBy({ estado });
  }
}
