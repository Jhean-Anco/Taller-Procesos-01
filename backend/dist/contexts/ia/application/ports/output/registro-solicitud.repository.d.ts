export declare const REPOSITORIO_REGISTRO_SOLICITUD: unique symbol;
export interface CrearRegistroSolicitud {
    prompt: string;
    respuesta: string;
    modelo: string;
    rolSolicitante: string;
}
export interface RepositorioRegistroSolicitud {
    crear(data: CrearRegistroSolicitud): Promise<void>;
}
