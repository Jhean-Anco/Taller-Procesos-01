import { ResultadoIntervencion } from '../enums/resultado-intervencion.enum';
export declare class Intervencion {
    readonly id: string;
    readonly fecha: string;
    readonly estrategia: string;
    readonly responsableId: string;
    readonly responsableRol: string;
    readonly resultado: ResultadoIntervencion;
    readonly observaciones: string;
    constructor(id: string, fecha: string, estrategia: string, responsableId: string, responsableRol: string, resultado: ResultadoIntervencion, observaciones: string);
}
