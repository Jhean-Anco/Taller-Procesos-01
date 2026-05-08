import { RespuestaIa } from '../../../domain/entities/respuesta-ia.entidad';

export const PUERTO_PROVEEDOR_IA = Symbol('PUERTO_PROVEEDOR_IA');

export interface PuertoProveedorIa {
  generarTexto(prompt: string): Promise<RespuestaIa>;
}
