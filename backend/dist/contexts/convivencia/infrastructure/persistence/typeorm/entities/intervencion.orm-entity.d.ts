import { IncidenciaPsicologicaOrmEntity } from './incidencia-psicologica.orm-entity';
export declare class IntervencionOrmEntity {
    id: string;
    fecha: Date;
    estrategia: string;
    responsableId: string;
    responsableRol: string;
    resultado: string;
    observaciones: string;
    incidenciaId: string;
    incidencia: IncidenciaPsicologicaOrmEntity;
}
