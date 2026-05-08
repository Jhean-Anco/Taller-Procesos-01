import { EncuestaEmocionalEntidad } from '../../../dominio/entidades/encuesta-emocional.entidad';

export abstract class RepositorioEncuestaPuerto {
  abstract guardar(encuesta: EncuestaEmocionalEntidad): Promise<EncuestaEmocionalEntidad>;
  abstract listar(): Promise<EncuestaEmocionalEntidad[]>;
  abstract contar(): Promise<number>;
  abstract contarConEvaluacionIa(): Promise<number>;
  abstract promedioRiesgo(): Promise<number>;
}
