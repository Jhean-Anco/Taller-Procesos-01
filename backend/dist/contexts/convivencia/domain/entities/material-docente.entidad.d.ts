export declare class MaterialDocente {
    readonly id: string;
    readonly titulo: string;
    readonly descripcion: string;
    readonly contenido: string;
    readonly creadoPor: string;
    readonly temas: string[];
    readonly publicoObjetivo: 'docentes' | 'equipo_psicologia' | 'mixto';
    readonly fecha: string;
    constructor(id: string, titulo: string, descripcion: string, contenido: string, creadoPor: string, temas: string[], publicoObjetivo: 'docentes' | 'equipo_psicologia' | 'mixto', fecha: string);
}
