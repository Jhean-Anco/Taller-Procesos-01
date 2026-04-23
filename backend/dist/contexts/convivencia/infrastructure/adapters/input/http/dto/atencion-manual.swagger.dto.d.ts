import { NivelAlerta } from '../../../../../domain/enums/nivel-alerta.enum';
import { NivelEscolar } from '../../../../../domain/enums/nivel-escolar.enum';
import { TipoIncidencia } from '../../../../../domain/enums/tipo-incidencia.enum';
export declare class AtencionManualSwaggerDto {
    id: string;
    fecha: string;
    nivelEscolar: NivelEscolar;
    grado: string;
    seccion: string;
    tipoIncidencia: TipoIncidencia;
    descripcion: string;
    observaciones: string;
    atendidoPor: string;
    nivelAlerta: NivelAlerta;
    alertaCritica: boolean;
}
