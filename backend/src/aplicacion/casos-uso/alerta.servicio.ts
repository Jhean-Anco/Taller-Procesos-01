import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AlertaEntidad } from '../../dominio/entidades/alerta.entidad';
import { SeguimientoAlertaEntidad } from '../../dominio/entidades/seguimiento-alerta.entidad';
import { ActualizarAlertaDto } from '../dto/actualizar-alerta.dto';
import { FiltroAlertasDto } from '../dto/filtro-alertas.dto';
import { HistoriaAlertaDto } from '../dto/historia-alerta.dto';
import { RegistrarSeguimientoAlertaDto } from '../dto/registrar-seguimiento-alerta.dto';
import { UsuarioAutenticadoDto } from '../dto/usuario-autenticado.dto';
import { GestionarAlertasCasoUso } from '../puertos/entrada/gestionar-alertas.caso-uso';
import { RepositorioAlertaPuerto } from '../puertos/salida/repositorio-alerta.puerto';
import { RepositorioSeguimientoAlertaPuerto } from '../puertos/salida/repositorio-seguimiento-alerta.puerto';

@Injectable()
export class AlertaServicio implements GestionarAlertasCasoUso {
  constructor(
    private readonly repositorioAlerta: RepositorioAlertaPuerto,
    private readonly repositorioSeguimientoAlerta: RepositorioSeguimientoAlertaPuerto,
  ) {}

  listar(filtros?: FiltroAlertasDto): Promise<AlertaEntidad[]> {
    return this.repositorioAlerta.listar(filtros);
  }

  async obtenerHistoria(id: string): Promise<HistoriaAlertaDto> {
    const historia = await this.repositorioAlerta.obtenerHistoriaPorId(id);

    if (!historia) {
      throw new NotFoundException('La alerta no existe');
    }

    return historia;
  }

  async actualizar(
    id: string,
    dto: ActualizarAlertaDto,
    usuarioActual: UsuarioAutenticadoDto,
  ): Promise<AlertaEntidad> {
    const alerta = await this.repositorioAlerta.obtenerPorId(id);

    if (!alerta) {
      throw new NotFoundException('La alerta no existe');
    }

    return this.repositorioAlerta.guardar(
      new AlertaEntidad(
        alerta.id,
        alerta.encuestaId,
        alerta.estudianteId,
        alerta.psicologoAsignadoId ?? usuarioActual.usuarioId,
        alerta.puntajeRiesgo,
        dto.estado,
        alerta.mensajeEtico,
        alerta.fechaCreacion,
        new Date(),
      ),
    );
  }

  async registrarSeguimiento(
    alertaId: string,
    dto: RegistrarSeguimientoAlertaDto,
    usuarioActual: UsuarioAutenticadoDto,
  ): Promise<SeguimientoAlertaEntidad> {
    const alerta = await this.repositorioAlerta.obtenerPorId(alertaId);

    if (!alerta) {
      throw new NotFoundException('La alerta no existe');
    }

    await this.repositorioAlerta.guardar(
      new AlertaEntidad(
        alerta.id,
        alerta.encuestaId,
        alerta.estudianteId,
        usuarioActual.usuarioId,
        alerta.puntajeRiesgo,
        alerta.estado,
        alerta.mensajeEtico,
        alerta.fechaCreacion,
        new Date(),
      ),
    );

    return this.repositorioSeguimientoAlerta.guardar(
      new SeguimientoAlertaEntidad(
        null,
        alertaId,
        usuarioActual.usuarioId,
        dto.accionGlobal.trim(),
        dto.descripcion.trim(),
        new Date(),
      ),
    );
  }
}
