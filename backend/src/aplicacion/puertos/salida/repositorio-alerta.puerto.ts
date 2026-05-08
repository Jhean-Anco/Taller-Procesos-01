import { HistoriaAlertaDto } from '../../dto/historia-alerta.dto';
import { FiltroAlertasDto } from '../../dto/filtro-alertas.dto';
import { AlertaEntidad, EstadoAlerta } from '../../../dominio/entidades/alerta.entidad';

export abstract class RepositorioAlertaPuerto {
  abstract guardar(alerta: AlertaEntidad): Promise<AlertaEntidad>;
  abstract listar(filtros?: FiltroAlertasDto): Promise<AlertaEntidad[]>;
  abstract listarEscaladasParaAdministracion(
    filtros?: FiltroAlertasDto,
  ): Promise<AlertaEntidad[]>;
  abstract obtenerPorId(id: string): Promise<AlertaEntidad | null>;
  abstract obtenerHistoriaPorId(id: string): Promise<HistoriaAlertaDto | null>;
  abstract contar(): Promise<number>;
  abstract contarPorEstado(estado: EstadoAlerta): Promise<number>;
  abstract contarPorRiesgoMinimo(riesgoMinimo: number): Promise<number>;
  abstract contarEscaladasParaAdministracion(): Promise<number>;
}
