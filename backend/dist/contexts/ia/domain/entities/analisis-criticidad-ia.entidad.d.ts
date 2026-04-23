import { NivelAlerta } from '../../../convivencia/domain/enums/nivel-alerta.enum';
export declare class AnalisisCriticidadIa {
    readonly nivelAlerta: NivelAlerta;
    readonly alertaCritica: boolean;
    readonly justificacion: string;
    constructor(nivelAlerta: NivelAlerta, alertaCritica: boolean, justificacion: string);
}
