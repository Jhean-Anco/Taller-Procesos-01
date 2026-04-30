import { EstadoAlerta } from '../../dominio/entidades/alerta.entidad';

export interface FiltroAlertasDto {
  estado?: EstadoAlerta | '';
  riesgoMinimo?: number;
  riesgoMaximo?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}
