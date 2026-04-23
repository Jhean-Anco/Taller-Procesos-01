export const REPOSITORIO_REGISTRO_SOLICITUD = Symbol(
  'REPOSITORIO_REGISTRO_SOLICITUD',
);

export interface CrearRegistroSolicitud {
  prompt: string;
  respuesta: string;
  modelo: string;
  rolSolicitante: string;
}

export interface RepositorioRegistroSolicitud {
  crear(data: CrearRegistroSolicitud): Promise<void>;
}
