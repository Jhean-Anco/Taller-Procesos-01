import { IntervencionOrmEntity } from './intervencion.orm-entity';
export declare class IncidenciaPsicologicaOrmEntity {
    id: string;
    origen: string;
    fecha: Date;
    nivelEscolar: string;
    grado: string;
    seccion: string;
    tipoIncidencia: string;
    descripcion: string;
    nivelAlerta: string;
    alertaCritica: boolean;
    estado: string;
    totalReportesRelacionados: number;
    intervenciones: IntervencionOrmEntity[];
}
