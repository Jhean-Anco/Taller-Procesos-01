import { ConfigService } from '@nestjs/config';
import type { PuertoVerificacionSalud } from '../../../application/ports/output/verificacion-salud.port';
import { Salud } from '../../../domain/entities/salud.entidad';
export declare class AdaptadorSaludSistema implements PuertoVerificacionSalud {
    private readonly configService;
    constructor(configService: ConfigService);
    verificar(): Promise<Salud>;
}
