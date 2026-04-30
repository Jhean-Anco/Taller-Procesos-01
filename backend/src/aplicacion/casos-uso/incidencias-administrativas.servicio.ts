import { Injectable, NotFoundException } from '@nestjs/common';
import { RegistrarProcesoAdministrativoDto } from '../dto/registrar-proceso-administrativo.dto';
import { FiltroAlertasDto } from '../dto/filtro-alertas.dto';
import { HistoriaAlertaDto } from '../dto/historia-alerta.dto';
import { RegistrarAvanceProcesoAdministrativoDto } from '../dto/registrar-avance-proceso-administrativo.dto';
import { UsuarioAutenticadoDto } from '../dto/usuario-autenticado.dto';
import { GestionarIncidenciasAdministrativasCasoUso } from '../puertos/entrada/gestionar-incidencias-administrativas.caso-uso';
import { RepositorioAlertaPuerto } from '../puertos/salida/repositorio-alerta.puerto';
import { RepositorioAvanceProcesoAdministrativoPuerto } from '../puertos/salida/repositorio-avance-proceso-administrativo.puerto';
import { RepositorioProcesoAdministrativoPuerto } from '../puertos/salida/repositorio-proceso-administrativo.puerto';
import { AvanceProcesoAdministrativoEntidad } from '../../dominio/entidades/avance-proceso-administrativo.entidad';
import { AlertaEntidad } from '../../dominio/entidades/alerta.entidad';
import { ProcesoAdministrativoEntidad } from '../../dominio/entidades/proceso-administrativo.entidad';

@Injectable()
export class IncidenciasAdministrativasServicio
  implements GestionarIncidenciasAdministrativasCasoUso
{
  constructor(
    private readonly repositorioAlerta: RepositorioAlertaPuerto,
    private readonly repositorioProcesoAdministrativo: RepositorioProcesoAdministrativoPuerto,
    private readonly repositorioAvanceProcesoAdministrativo: RepositorioAvanceProcesoAdministrativoPuerto,
  ) {}

  listarIncidencias(filtros?: FiltroAlertasDto): Promise<AlertaEntidad[]> {
    return this.repositorioAlerta.listar(filtros);
  }

  async obtenerHistoriaIncidencia(id: string): Promise<HistoriaAlertaDto> {
    const historia = await this.repositorioAlerta.obtenerHistoriaPorId(id);
    if (!historia) {
      throw new NotFoundException('La incidencia no existe');
    }
    return historia;
  }

  async registrarProceso(
    alertaId: string,
    dto: RegistrarProcesoAdministrativoDto,
    usuarioActual: UsuarioAutenticadoDto,
  ): Promise<ProcesoAdministrativoEntidad> {
    const alerta = await this.repositorioAlerta.obtenerPorId(alertaId);
    if (!alerta) {
      throw new NotFoundException('La incidencia no existe');
    }

    return this.repositorioProcesoAdministrativo.guardar(
      new ProcesoAdministrativoEntidad(
        null,
        alertaId,
        usuarioActual.usuarioId,
        dto.accionInstitucional.trim(),
        dto.descripcionInicial.trim(),
        dto.responsable?.trim() || null,
        dto.fechaObjetivo ? new Date(dto.fechaObjetivo) : null,
        dto.estado,
        new Date(),
        new Date(),
      ),
    );
  }

  async registrarAvanceProceso(
    procesoId: string,
    dto: RegistrarAvanceProcesoAdministrativoDto,
    usuarioActual: UsuarioAutenticadoDto,
  ): Promise<AvanceProcesoAdministrativoEntidad> {
    const proceso = await this.repositorioProcesoAdministrativo.obtenerPorId(procesoId);
    if (!proceso) {
      throw new NotFoundException('El proceso administrativo no existe');
    }

    await this.repositorioProcesoAdministrativo.guardar(
      new ProcesoAdministrativoEntidad(
        proceso.id,
        proceso.alertaId,
        proceso.administrativoId,
        proceso.accionInstitucional,
        proceso.descripcionInicial,
        proceso.responsable,
        proceso.fechaObjetivo,
        dto.estado,
        proceso.fechaCreacion,
        new Date(),
      ),
    );

    return this.repositorioAvanceProcesoAdministrativo.guardar(
      new AvanceProcesoAdministrativoEntidad(
        null,
        procesoId,
        usuarioActual.usuarioId,
        dto.descripcionAvance.trim(),
        dto.tipo,
        dto.estado,
        new Date(),
      ),
    );
  }
}
