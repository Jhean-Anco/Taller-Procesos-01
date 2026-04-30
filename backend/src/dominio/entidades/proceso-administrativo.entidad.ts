export type EstadoProcesoAdministrativo =
  | 'pendiente'
  | 'en_proceso'
  | 'completado';

export class ProcesoAdministrativoEntidad {
  constructor(
    public readonly id: string | null,
    public readonly alertaId: string,
    public readonly administrativoId: string,
    public readonly accionInstitucional: string,
    public readonly descripcionInicial: string,
    public readonly responsable: string | null,
    public readonly fechaObjetivo: Date | null,
    public readonly estado: EstadoProcesoAdministrativo,
    public readonly fechaCreacion: Date,
    public readonly fechaActualizacion: Date,
  ) {}
}
