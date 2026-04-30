export type EstadoAlerta = 'pendiente' | 'evaluacion' | 'cerrada';

export interface AlertaEntidad {
  id: string;
  encuestaId: string;
  estudianteId: string;
  psicologoAsignadoId?: string | null;
  puntajeRiesgo: number;
  estado: EstadoAlerta;
  mensajeEtico: string;
  fechaCreacion: string;
  ultimaActualizacion?: string;
}
