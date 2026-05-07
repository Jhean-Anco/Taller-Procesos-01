import { IaService } from '../../../ia/application/services/ia.service';
import { CrearIntervencion, CrearMaterialDocente, CrearUsuarioInstitucional, UsuarioAutenticable } from '../ports/output/convivencia.repository';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { AtencionManual } from '../../domain/entities/atencion-manual.entidad';
import { EstadisticasClimaEscolar } from '../../domain/entities/estadisticas-clima-escolar.entidad';
import { IncidenciaPsicologica } from '../../domain/entities/incidencia-psicologica.entidad';
import { Intervencion } from '../../domain/entities/intervencion.entidad';
import { MaterialDocente } from '../../domain/entities/material-docente.entidad';
import { ReporteAnonimo } from '../../domain/entities/reporte-anonimo.entidad';
import { UsuarioInstitucional } from '../../domain/entities/usuario-institucional.entidad';
import { NivelEscolar } from '../../domain/enums/nivel-escolar.enum';
import { TipoIncidencia } from '../../domain/enums/tipo-incidencia.enum';
export interface SolicitudMaterialIa {
    tema: string;
    nivelEscolar: string;
    objetivo: string;
    rolSolicitante: string;
}
export interface SolicitudReporteAnonimo {
    nivelEscolar: NivelEscolar;
    grado: string;
    seccion: string;
    tipoIncidencia: TipoIncidencia;
    descripcion: string;
}
export interface SolicitudIncidenciaManual {
    nivelEscolar: NivelEscolar;
    grado: string;
    seccion: string;
    tipoIncidencia: TipoIncidencia;
    descripcion: string;
}
export interface SolicitudAtencionManual {
    nivelEscolar: NivelEscolar;
    grado: string;
    seccion: string;
    tipoIncidencia: TipoIncidencia;
    descripcion: string;
    observaciones: string;
    atendidoPor: string;
}
export declare class ConvivenciaService {
    private readonly repositorioConvivencia;
    private readonly iaService;
    constructor(repositorioConvivencia: RepositorioConvivencia, iaService: IaService);
    registrarUsuarioInstitucional(data: CrearUsuarioInstitucional): Promise<UsuarioInstitucional>;
    obtenerUsuarioAutenticablePorCorreo(correo: string): Promise<UsuarioAutenticable | null>;
    listarUsuariosInstitucionales(): Promise<UsuarioInstitucional[]>;
    registrarReporteAnonimo(data: SolicitudReporteAnonimo): Promise<ReporteAnonimo>;
    crearIncidenciaDesdeReporte(reporteId: string): Promise<IncidenciaPsicologica>;
    crearIncidenciaManual(data: SolicitudIncidenciaManual): Promise<IncidenciaPsicologica>;
    listarIncidencias(): Promise<IncidenciaPsicologica[]>;
    agregarIntervencion(incidenciaId: string, data: CrearIntervencion): Promise<Intervencion>;
    crearMaterialDocente(data: CrearMaterialDocente): Promise<MaterialDocente>;
    listarMaterialesDocentes(): Promise<MaterialDocente[]>;
    registrarAtencionManual(data: SolicitudAtencionManual): Promise<AtencionManual>;
    listarAlertasCriticas(): Promise<IncidenciaPsicologica[]>;
    obtenerEstadisticasClimaEscolar(): Promise<EstadisticasClimaEscolar>;
    generarMaterialIa({ tema, nivelEscolar, objetivo, rolSolicitante, }: SolicitudMaterialIa): Promise<{
        materialSugerido: string;
    }>;
    generarRecomendacionesIa(rolSolicitante: string): Promise<{
        recomendaciones: string;
    }>;
}
