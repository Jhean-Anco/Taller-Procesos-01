import { NivelAlerta } from '../../../convivencia/domain/enums/nivel-alerta.enum';

export class AnalisisCriticidadIa {
  constructor(
    public readonly nivelAlerta: NivelAlerta,
    public readonly alertaCritica: boolean,
    public readonly justificacion: string,
  ) {}
}
