import type { PuertoVerificacionSalud } from '../ports/output/verificacion-salud.port';
import { Salud } from '../../domain/entities/salud.entidad';
export declare class SaludService {
    private readonly puertoVerificacionSalud;
    constructor(puertoVerificacionSalud: PuertoVerificacionSalud);
    obtenerSalud(): Promise<Salud>;
}
