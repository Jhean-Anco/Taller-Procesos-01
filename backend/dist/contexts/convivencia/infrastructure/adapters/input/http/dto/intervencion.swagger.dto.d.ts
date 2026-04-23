import { ResultadoIntervencion } from '../../../../../domain/enums/resultado-intervencion.enum';
export declare class IntervencionSwaggerDto {
    id: string;
    fecha: string;
    estrategia: string;
    responsableId: string;
    responsableRol: string;
    resultado: ResultadoIntervencion;
    observaciones: string;
}
