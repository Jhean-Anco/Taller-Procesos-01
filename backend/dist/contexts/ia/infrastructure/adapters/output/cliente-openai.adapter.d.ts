import { ConfigService } from '@nestjs/config';
import type { PuertoProveedorIa } from '../../../application/ports/output/proveedor-ia.port';
import { RespuestaIa } from '../../../domain/entities/respuesta-ia.entidad';
export declare class AdaptadorClienteOpenAi implements PuertoProveedorIa {
    private readonly configService;
    constructor(configService: ConfigService);
    generarTexto(prompt: string): Promise<RespuestaIa>;
}
