import { Salud } from '../../../domain/entities/salud.entidad';
export declare const PUERTO_VERIFICACION_SALUD: unique symbol;
export interface PuertoVerificacionSalud {
    verificar(): Promise<Salud>;
}
