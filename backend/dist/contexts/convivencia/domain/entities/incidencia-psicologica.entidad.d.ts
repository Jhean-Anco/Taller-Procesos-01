import { EstadoIncidencia } from '../enums/estado-incidencia.enum';
import { NivelAlerta } from '../enums/nivel-alerta.enum';
import { NivelEscolar } from '../enums/nivel-escolar.enum';
import { TipoIncidencia } from '../enums/tipo-incidencia.enum';
import { Intervencion } from './intervencion.entidad';
export declare class IncidenciaPsicologica {
    readonly id: string;
    readonly origen: 'reporte_anonimo' | 'registro_manual';
    readonly fecha: string;
    readonly nivelEscolar: NivelEscolar;
    readonly grado: string;
    readonly seccion: string;
    readonly tipoIncidencia: TipoIncidencia;
    readonly descripcion: string;
    readonly nivelAlerta: NivelAlerta;
    readonly alertaCritica: boolean;
    readonly estado: EstadoIncidencia;
    readonly totalReportesRelacionados: number;
    readonly intervenciones: Intervencion[];
    constructor(id: string, origen: 'reporte_anonimo' | 'registro_manual', fecha: string, nivelEscolar: NivelEscolar, grado: string, seccion: string, tipoIncidencia: TipoIncidencia, descripcion: string, nivelAlerta: NivelAlerta, alertaCritica: boolean, estado: EstadoIncidencia, totalReportesRelacionados: number, intervenciones: Intervencion[]);
}
