import { EstadoIncidencia } from '../enums/estado-incidencia.enum';
import { NivelAlerta } from '../enums/nivel-alerta.enum';
import { NivelEscolar } from '../enums/nivel-escolar.enum';
import { TipoIncidencia } from '../enums/tipo-incidencia.enum';
import { Intervencion } from './intervencion.entidad';

export class IncidenciaPsicologica {
  constructor(
    public readonly id: string,
    public readonly origen: 'reporte_anonimo' | 'registro_manual',
    public readonly fecha: string,
    public readonly nivelEscolar: NivelEscolar,
    public readonly grado: string,
    public readonly seccion: string,
    public readonly tipoIncidencia: TipoIncidencia,
    public readonly descripcion: string,
    public readonly nivelAlerta: NivelAlerta,
    public readonly alertaCritica: boolean,
    public readonly estado: EstadoIncidencia,
    public readonly totalReportesRelacionados: number,
    public readonly intervenciones: Intervencion[],
  ) {}
}
