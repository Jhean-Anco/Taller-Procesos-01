import type { PuertoVerificacionSalud } from '../ports/output/verificacion-salud.port';
import { Salud } from '../../domain/entities/salud.entidad';
import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
export declare class ObtenerSaludCasoDeUso implements CasoDeUso<Promise<Salud>> {
    private readonly puertoVerificacionSalud;
    constructor(puertoVerificacionSalud: PuertoVerificacionSalud);
    ejecutar(): Promise<Salud>;
}
