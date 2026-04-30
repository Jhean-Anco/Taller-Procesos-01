import { ActualizarAlertaDto } from '../../dto/actualizar-alerta.dto';
import { FiltroAlertasDto } from '../../dto/filtro-alertas.dto';
import { HistoriaAlertaDto } from '../../dto/historia-alerta.dto';
import { RegistrarSeguimientoAlertaDto } from '../../dto/registrar-seguimiento-alerta.dto';
import { UsuarioAutenticadoDto } from '../../dto/usuario-autenticado.dto';
import { AlertaEntidad } from '../../../dominio/entidades/alerta.entidad';
import { SeguimientoAlertaEntidad } from '../../../dominio/entidades/seguimiento-alerta.entidad';

export abstract class GestionarAlertasCasoUso {
  abstract listar(filtros?: FiltroAlertasDto): Promise<AlertaEntidad[]>;
  abstract obtenerHistoria(id: string): Promise<HistoriaAlertaDto>;
  abstract actualizar(
    id: string,
    dto: ActualizarAlertaDto,
    usuarioActual: UsuarioAutenticadoDto,
  ): Promise<AlertaEntidad>;
  abstract registrarSeguimiento(
    alertaId: string,
    dto: RegistrarSeguimientoAlertaDto,
    usuarioActual: UsuarioAutenticadoDto,
  ): Promise<SeguimientoAlertaEntidad>;
}
