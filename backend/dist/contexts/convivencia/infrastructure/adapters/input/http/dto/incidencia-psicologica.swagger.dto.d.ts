import { EstadoIncidencia } from '../../../../../domain/enums/estado-incidencia.enum';
import { NivelAlerta } from '../../../../../domain/enums/nivel-alerta.enum';
import { NivelEscolar } from '../../../../../domain/enums/nivel-escolar.enum';
import { TipoIncidencia } from '../../../../../domain/enums/tipo-incidencia.enum';
import { IntervencionSwaggerDto } from './intervencion.swagger.dto';
export declare class IncidenciaPsicologicaSwaggerDto {
    id: string;
    origen: 'reporte_anonimo' | 'registro_manual';
    fecha: string;
    nivelEscolar: NivelEscolar;
    grado: string;
    seccion: string;
    tipoIncidencia: TipoIncidencia;
    descripcion: string;
    nivelAlerta: NivelAlerta;
    alertaCritica: boolean;
    estado: EstadoIncidencia;
    totalReportesRelacionados: number;
    intervenciones: IntervencionSwaggerDto[];
}
