import { RegistrarEncuestaDto } from '../../dto/registrar-encuesta.dto';
import { EncuestaEmocionalEntidad } from '../../../dominio/entidades/encuesta-emocional.entidad';

export abstract class RegistrarEncuestaCasoUso {
  abstract registrar(dto: RegistrarEncuestaDto): Promise<EncuestaEmocionalEntidad>;
  abstract listar(): Promise<EncuestaEmocionalEntidad[]>;
}
