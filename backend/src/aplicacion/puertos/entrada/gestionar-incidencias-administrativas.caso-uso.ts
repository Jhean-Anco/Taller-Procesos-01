import { FiltroAlertasDto } from '../../dto/filtro-alertas.dto';
import { HistoriaAlertaDto } from '../../dto/historia-alerta.dto';
import { RegistrarAvanceProcesoAdministrativoDto } from '../../dto/registrar-avance-proceso-administrativo.dto';
import { RegistrarProcesoAdministrativoDto } from '../../dto/registrar-proceso-administrativo.dto';
import { UsuarioAutenticadoDto } from '../../dto/usuario-autenticado.dto';
import { AvanceProcesoAdministrativoEntidad } from '../../../dominio/entidades/avance-proceso-administrativo.entidad';
import { AlertaEntidad } from '../../../dominio/entidades/alerta.entidad';
import { ProcesoAdministrativoEntidad } from '../../../dominio/entidades/proceso-administrativo.entidad';

export abstract class GestionarIncidenciasAdministrativasCasoUso {
  abstract listarIncidencias(filtros?: FiltroAlertasDto): Promise<AlertaEntidad[]>;
  abstract obtenerHistoriaIncidencia(id: string): Promise<HistoriaAlertaDto>;
  abstract registrarProceso(
    alertaId: string,
    dto: RegistrarProcesoAdministrativoDto,
    usuarioActual: UsuarioAutenticadoDto,
  ): Promise<ProcesoAdministrativoEntidad>;
  abstract registrarAvanceProceso(
    procesoId: string,
    dto: RegistrarAvanceProcesoAdministrativoDto,
    usuarioActual: UsuarioAutenticadoDto,
  ): Promise<AvanceProcesoAdministrativoEntidad>;
}
