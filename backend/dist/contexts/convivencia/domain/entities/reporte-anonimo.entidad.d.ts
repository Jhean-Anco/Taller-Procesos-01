import { NivelAlerta } from '../enums/nivel-alerta.enum';
import { NivelEscolar } from '../enums/nivel-escolar.enum';
import { TipoIncidencia } from '../enums/tipo-incidencia.enum';
export declare class ReporteAnonimo {
    readonly id: string;
    readonly fecha: string;
    readonly nivelEscolar: NivelEscolar;
    readonly grado: string;
    readonly seccion: string;
    readonly tipoIncidencia: TipoIncidencia;
    readonly descripcion: string;
    readonly nivelAlerta: NivelAlerta;
    readonly alertaCritica: boolean;
    readonly estado: 'nuevo' | 'escalado';
    constructor(id: string, fecha: string, nivelEscolar: NivelEscolar, grado: string, seccion: string, tipoIncidencia: TipoIncidencia, descripcion: string, nivelAlerta: NivelAlerta, alertaCritica: boolean, estado: 'nuevo' | 'escalado');
}
