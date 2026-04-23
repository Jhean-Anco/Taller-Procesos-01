import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import { RespuestaIa } from '../../domain/entities/respuesta-ia.entidad';
import type { PuertoProveedorIa } from '../ports/output/proveedor-ia.port';
import type { RepositorioRegistroSolicitud } from '../ports/output/registro-solicitud.repository';
export interface ComandoGenerarTexto {
    prompt: string;
    rolSolicitante: string;
}
export declare class GenerarTextoCasoDeUso implements CasoDeUso<Promise<RespuestaIa>, [
    ComandoGenerarTexto
]> {
    private readonly proveedorIa;
    private readonly repositorioRegistroSolicitud;
    constructor(proveedorIa: PuertoProveedorIa, repositorioRegistroSolicitud: RepositorioRegistroSolicitud);
    ejecutar(command: ComandoGenerarTexto): Promise<RespuestaIa>;
}
