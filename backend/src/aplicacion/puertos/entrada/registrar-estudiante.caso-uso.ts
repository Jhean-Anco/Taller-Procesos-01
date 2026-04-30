import { RegistrarEstudianteDto } from '../../dto/registrar-estudiante.dto';
import { EstudianteEntidad } from '../../../dominio/entidades/estudiante.entidad';

export abstract class RegistrarEstudianteCasoUso {
  abstract registrar(dto: RegistrarEstudianteDto): Promise<EstudianteEntidad>;
  abstract listar(): Promise<EstudianteEntidad[]>;
  abstract obtenerPorId(id: string): Promise<EstudianteEntidad | null>;
}
