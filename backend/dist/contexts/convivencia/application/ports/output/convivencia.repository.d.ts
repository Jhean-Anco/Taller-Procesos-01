import { AtencionManual } from '../../../domain/entities/atencion-manual.entidad';
import { EstadisticasClimaEscolar } from '../../../domain/entities/estadisticas-clima-escolar.entidad';
import { IncidenciaPsicologica } from '../../../domain/entities/incidencia-psicologica.entidad';
import { Intervencion } from '../../../domain/entities/intervencion.entidad';
import { MaterialDocente } from '../../../domain/entities/material-docente.entidad';
import { ReporteAnonimo } from '../../../domain/entities/reporte-anonimo.entidad';
import { UsuarioInstitucional } from '../../../domain/entities/usuario-institucional.entidad';
import { NivelAlerta } from '../../../domain/enums/nivel-alerta.enum';
import { NivelEscolar } from '../../../domain/enums/nivel-escolar.enum';
import { ResultadoIntervencion } from '../../../domain/enums/resultado-intervencion.enum';
import { TipoIncidencia } from '../../../domain/enums/tipo-incidencia.enum';
import { Rol } from '../../../../../shared/domain/enums/rol.enum';
export declare const REPOSITORIO_CONVIVENCIA: unique symbol;
export interface CrearUsuarioInstitucional {
    nombre: string;
    correo: string;
    rol: Rol;
    area: string;
    password: string;
}
export interface UsuarioAutenticable {
    id: string;
    nombre: string;
    correo: string;
    rol: Rol;
    activo: boolean;
    passwordHash: string;
}
export interface CrearReporteAnonimo {
    nivelEscolar: NivelEscolar;
    grado: string;
    seccion: string;
    tipoIncidencia: TipoIncidencia;
    descripcion: string;
    nivelAlerta: NivelAlerta;
}
export interface CrearAtencionManual {
    nivelEscolar: NivelEscolar;
    grado: string;
    seccion: string;
    tipoIncidencia: TipoIncidencia;
    descripcion: string;
    observaciones: string;
    atendidoPor: string;
    nivelAlerta: NivelAlerta;
}
export interface CrearIncidenciaManual {
    nivelEscolar: NivelEscolar;
    grado: string;
    seccion: string;
    tipoIncidencia: TipoIncidencia;
    descripcion: string;
    nivelAlerta: NivelAlerta;
}
export interface CrearMaterialDocente {
    titulo: string;
    descripcion: string;
    contenido: string;
    creadoPor: string;
    temas: string[];
    publicoObjetivo: 'docentes' | 'equipo_psicologia' | 'mixto';
}
export interface CrearIntervencion {
    estrategia: string;
    responsableId: string;
    responsableRol: string;
    resultado: ResultadoIntervencion;
    observaciones: string;
}
export interface RepositorioConvivencia {
    crearUsuarioInstitucional(data: CrearUsuarioInstitucional): Promise<UsuarioInstitucional>;
    obtenerUsuarioAutenticablePorCorreo(correo: string): Promise<UsuarioAutenticable | null>;
    listarUsuariosInstitucionales(): Promise<UsuarioInstitucional[]>;
    crearReporteAnonimo(data: CrearReporteAnonimo): Promise<ReporteAnonimo>;
    listarReportesAnonimos(): Promise<ReporteAnonimo[]>;
    crearIncidenciaDesdeReporte(reporteId: string): Promise<IncidenciaPsicologica>;
    crearIncidenciaManual(data: CrearIncidenciaManual): Promise<IncidenciaPsicologica>;
    listarIncidencias(): Promise<IncidenciaPsicologica[]>;
    agregarIntervencion(incidenciaId: string, data: CrearIntervencion): Promise<Intervencion>;
    crearMaterialDocente(data: CrearMaterialDocente): Promise<MaterialDocente>;
    listarMaterialesDocentes(): Promise<MaterialDocente[]>;
    registrarAtencionManual(data: CrearAtencionManual): Promise<AtencionManual>;
    listarAlertasCriticas(): Promise<IncidenciaPsicologica[]>;
    obtenerEstadisticasClimaEscolar(): Promise<EstadisticasClimaEscolar>;
}
