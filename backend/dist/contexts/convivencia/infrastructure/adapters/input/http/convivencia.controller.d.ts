import { Request } from 'express';
import { ConvivenciaService } from '../../../../application/services/convivencia.service';
import { CrearIncidenciaManualDto } from './dto/crear-incidencia-manual.dto';
import { CrearMaterialDocenteDto } from './dto/crear-material-docente.dto';
import { GenerarMaterialIaDto } from './dto/generar-material-ia.dto';
import { RegistrarAtencionManualDto } from './dto/registrar-atencion-manual.dto';
import { RegistrarReporteAnonimoDto } from './dto/registrar-reporte-anonimo.dto';
import { RegistrarUsuarioInstitucionalDto } from './dto/registrar-usuario-institucional.dto';
import { AgregarIntervencionDto } from './dto/agregar-intervencion.dto';
import { UsuarioAutenticado } from '../../../../../../shared/infrastructure/auth/usuario-autenticado.interface';
type PeticionConUsuario = Request & {
    usuario: UsuarioAutenticado;
};
export declare class ConvivenciaControlador {
    private readonly convivenciaService;
    constructor(convivenciaService: ConvivenciaService);
    registrarUsuarioInstitucional(body: RegistrarUsuarioInstitucionalDto): Promise<import("../../../../domain/entities/usuario-institucional.entidad").UsuarioInstitucional>;
    listarUsuariosInstitucionales(): Promise<import("../../../../domain/entities/usuario-institucional.entidad").UsuarioInstitucional[]>;
    registrarReporteAnonimo(body: RegistrarReporteAnonimoDto): Promise<import("../../../../domain/entities/reporte-anonimo.entidad").ReporteAnonimo>;
    crearIncidenciaDesdeReporte(reporteId: string): Promise<import("../../../../domain/entities/incidencia-psicologica.entidad").IncidenciaPsicologica>;
    crearIncidenciaManual(body: CrearIncidenciaManualDto): Promise<import("../../../../domain/entities/incidencia-psicologica.entidad").IncidenciaPsicologica>;
    listarIncidencias(): Promise<import("../../../../domain/entities/incidencia-psicologica.entidad").IncidenciaPsicologica[]>;
    agregarIntervencion(incidenciaId: string, body: AgregarIntervencionDto, request: PeticionConUsuario): Promise<import("../../../../domain/entities/intervencion.entidad").Intervencion>;
    crearMaterialDocente(body: CrearMaterialDocenteDto, request: PeticionConUsuario): Promise<import("../../../../domain/entities/material-docente.entidad").MaterialDocente>;
    listarMaterialesDocentes(): Promise<import("../../../../domain/entities/material-docente.entidad").MaterialDocente[]>;
    registrarAtencionManual(body: RegistrarAtencionManualDto, request: PeticionConUsuario): Promise<import("../../../../domain/entities/atencion-manual.entidad").AtencionManual>;
    listarAlertasCriticas(): Promise<import("../../../../domain/entities/incidencia-psicologica.entidad").IncidenciaPsicologica[]>;
    obtenerEstadisticasClimaEscolar(): Promise<import("../../../../domain/entities/estadisticas-clima-escolar.entidad").EstadisticasClimaEscolar>;
    generarMaterialIa(body: GenerarMaterialIaDto, request: PeticionConUsuario): Promise<{
        materialSugerido: string;
    }>;
    generarRecomendacionesIa(request: PeticionConUsuario): Promise<{
        recomendaciones: string;
    }>;
}
export {};
