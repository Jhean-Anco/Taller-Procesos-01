import { RespuestaIa } from '../../../domain/entities/respuesta-ia.entidad';
export declare const PUERTO_PROVEEDOR_IA: unique symbol;
export interface PuertoProveedorIa {
    generarTexto(prompt: string): Promise<RespuestaIa>;
}
