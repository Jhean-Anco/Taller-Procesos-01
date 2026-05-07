import type { PuertoProveedorIa } from '../ports/output/proveedor-ia.port';
import type { RepositorioRegistroSolicitud } from '../ports/output/registro-solicitud.repository';
import { AnalisisCriticidadIa } from '../../domain/entities/analisis-criticidad-ia.entidad';
import { RespuestaIa } from '../../domain/entities/respuesta-ia.entidad';
export interface SolicitudGeneracionTexto {
    prompt: string;
    rolSolicitante: string;
}
export interface SolicitudAnalisisCriticidad {
    origen: 'reporte_anonimo' | 'incidencia_manual' | 'atencion_manual';
    nivelEscolar: string;
    grado: string;
    seccion: string;
    tipoIncidencia: string;
    descripcion: string;
    observaciones?: string;
}
export declare class IaService {
    private readonly puertoProveedorIa;
    private readonly repositorioRegistroSolicitud;
    constructor(puertoProveedorIa: PuertoProveedorIa, repositorioRegistroSolicitud: RepositorioRegistroSolicitud);
    generarTexto({ prompt, rolSolicitante, }: SolicitudGeneracionTexto): Promise<RespuestaIa>;
    analizarCriticidad(solicitud: SolicitudAnalisisCriticidad): Promise<AnalisisCriticidadIa>;
    private parsearAnalisisCriticidad;
    private extraerBloqueJson;
}
