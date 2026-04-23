import { NivelAlerta } from '../enums/nivel-alerta.enum';
import { NivelEscolar } from '../enums/nivel-escolar.enum';
import { TipoIncidencia } from '../enums/tipo-incidencia.enum';
export declare class AtencionManual {
    readonly id: string;
    readonly fecha: string;
    readonly nivelEscolar: NivelEscolar;
    readonly grado: string;
    readonly seccion: string;
    readonly tipoIncidencia: TipoIncidencia;
    readonly descripcion: string;
    readonly observaciones: string;
    readonly atendidoPor: string;
    readonly nivelAlerta: NivelAlerta;
    readonly alertaCritica: boolean;
    constructor(id: string, fecha: string, nivelEscolar: NivelEscolar, grado: string, seccion: string, tipoIncidencia: TipoIncidencia, descripcion: string, observaciones: string, atendidoPor: string, nivelAlerta: NivelAlerta, alertaCritica: boolean);
}
