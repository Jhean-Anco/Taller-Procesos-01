import { IsIn } from 'class-validator';
import { EstadoAlerta } from '../../dominio/entidades/alerta.entidad';

export class ActualizarAlertaDto {
  @IsIn(['pendiente', 'evaluacion', 'cerrada'])
  estado!: EstadoAlerta;
}
