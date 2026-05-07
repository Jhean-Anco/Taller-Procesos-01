import { Repository } from 'typeorm';
import type { CrearRegistroSolicitud, RepositorioRegistroSolicitud } from '../../../../application/ports/output/registro-solicitud.repository';
import { RegistroSolicitudOrmEntidad } from '../entities/registro-solicitud.orm-entidad';
export declare class RepositorioRegistroSolicitudTypeOrm implements RepositorioRegistroSolicitud {
    private readonly repository;
    constructor(repository: Repository<RegistroSolicitudOrmEntidad>);
    crear(data: CrearRegistroSolicitud): Promise<void>;
}
