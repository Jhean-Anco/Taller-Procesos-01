import { SaludService } from '../../../../application/services/salud.service';
import { Salud } from '../../../../domain/entities/salud.entidad';
export declare class SaludControlador {
    private readonly saludService;
    constructor(saludService: SaludService);
    obtenerSalud(): Promise<Salud>;
}
