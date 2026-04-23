import { NivelAlerta } from '../../../../../domain/enums/nivel-alerta.enum';
import { NivelEscolar } from '../../../../../domain/enums/nivel-escolar.enum';
import { TipoIncidencia } from '../../../../../domain/enums/tipo-incidencia.enum';
export declare class ReporteAnonimoSwaggerDto {
    id: string;
    fecha: string;
    nivelEscolar: NivelEscolar;
    grado: string;
    seccion: string;
    tipoIncidencia: TipoIncidencia;
    descripcion: string;
    nivelAlerta: NivelAlerta;
    alertaCritica: boolean;
    estado: 'nuevo' | 'escalado';
}
