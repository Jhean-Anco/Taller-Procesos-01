import type { CrearRegistroSolicitud, RepositorioRegistroSolicitud } from '../../../application/ports/output/registro-solicitud.repository';
export declare class RepositorioRegistroSolicitudMemoria implements RepositorioRegistroSolicitud {
    private readonly registros;
    crear(data: CrearRegistroSolicitud): Promise<void>;
}
