import { FiltroAlertasDto } from '../../dto/filtro-alertas.dto';
import { IniciarSesionDto } from '../../dto/iniciar-sesion.dto';
import { RegistrarAvanceProcesoAdministrativoDto } from '../../dto/registrar-avance-proceso-administrativo.dto';
import { RegistrarProcesoAdministrativoDto } from '../../dto/registrar-proceso-administrativo.dto';
import { RegistrarSeguimientoAlertaDto } from '../../dto/registrar-seguimiento-alerta.dto';
import { ActualizarAlertaDto } from '../../dto/actualizar-alerta.dto';
import { RegistrarEncuestaDto } from '../../dto/registrar-encuesta.dto';
import { RegistrarEstudianteDto } from '../../dto/registrar-estudiante.dto';
import { AlertaEntidad } from '../../../dominio/entidades/alerta.entidad';
import { AvanceProcesoAdministrativoEntidad } from '../../../dominio/entidades/avance-proceso-administrativo.entidad';
import { EncuestaEmocionalEntidad } from '../../../dominio/entidades/encuesta-emocional.entidad';
import { HistoriaAlertaEntidad } from '../../../dominio/entidades/historia-alerta.entidad';
import { PanelEntidad } from '../../../dominio/entidades/panel.entidad';
import { ProcesoAdministrativoEntidad } from '../../../dominio/entidades/proceso-administrativo.entidad';
import { SesionEntidad } from '../../../dominio/entidades/sesion.entidad';
import { SeguimientoAlertaEntidad } from '../../../dominio/entidades/seguimiento-alerta.entidad';
import { EstudianteEntidad } from '../../../dominio/entidades/estudiante.entidad';

export interface ClienteApiPuerto {
  iniciarSesion(dto: IniciarSesionDto): Promise<SesionEntidad>;
  obtenerPerfilActual(): Promise<SesionEntidad['usuario']>;
  registrarEstudiante(dto: RegistrarEstudianteDto): Promise<EstudianteEntidad>;
  listarEstudiantes(): Promise<EstudianteEntidad[]>;
  registrarEncuesta(dto: RegistrarEncuestaDto): Promise<EncuestaEmocionalEntidad>;
  listarEncuestas(): Promise<EncuestaEmocionalEntidad[]>;
  listarAlertas(filtros?: FiltroAlertasDto): Promise<AlertaEntidad[]>;
  obtenerHistoriaAlerta(id: string): Promise<HistoriaAlertaEntidad>;
  actualizarAlerta(id: string, dto: ActualizarAlertaDto): Promise<AlertaEntidad>;
  registrarSeguimientoAlerta(
    id: string,
    dto: RegistrarSeguimientoAlertaDto,
  ): Promise<SeguimientoAlertaEntidad>;
  listarIncidenciasAdministrativas(filtros?: FiltroAlertasDto): Promise<AlertaEntidad[]>;
  obtenerHistoriaIncidenciaAdministrativa(id: string): Promise<HistoriaAlertaEntidad>;
  registrarProcesoAdministrativo(
    id: string,
    dto: RegistrarProcesoAdministrativoDto,
  ): Promise<ProcesoAdministrativoEntidad>;
  registrarAvanceProcesoAdministrativo(
    procesoId: string,
    dto: RegistrarAvanceProcesoAdministrativoDto,
  ): Promise<AvanceProcesoAdministrativoEntidad>;
  obtenerPanel(): Promise<PanelEntidad>;
}
