import { NivelAlerta } from '../enums/nivel-alerta.enum';
import { NivelEscolar } from '../enums/nivel-escolar.enum';
import { TipoIncidencia } from '../enums/tipo-incidencia.enum';

export class AtencionManual {
  constructor(
    public readonly id: string,
    public readonly fecha: string,
    public readonly nivelEscolar: NivelEscolar,
    public readonly grado: string,
    public readonly seccion: string,
    public readonly tipoIncidencia: TipoIncidencia,
    public readonly descripcion: string,
    public readonly observaciones: string,
    public readonly atendidoPor: string,
    public readonly nivelAlerta: NivelAlerta,
    public readonly alertaCritica: boolean,
  ) {}
}
