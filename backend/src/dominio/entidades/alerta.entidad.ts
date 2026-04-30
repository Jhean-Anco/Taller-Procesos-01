export type EstadoAlerta = 'pendiente' | 'evaluacion' | 'cerrada';

export class AlertaEntidad {
  constructor(
    public readonly id: string | null,
    public readonly encuestaId: string,
    public readonly estudianteId: string,
    public readonly psicologoAsignadoId: string | null,
    public readonly puntajeRiesgo: number,
    public readonly estado: EstadoAlerta,
    public readonly mensajeEtico: string,
    public readonly fechaCreacion: Date,
    public readonly ultimaActualizacion: Date,
  ) {}
}
