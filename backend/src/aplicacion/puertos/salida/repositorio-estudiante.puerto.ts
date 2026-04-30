import { EstudianteEntidad } from '../../../dominio/entidades/estudiante.entidad';

export abstract class RepositorioEstudiantePuerto {
  abstract guardar(estudiante: EstudianteEntidad): Promise<EstudianteEntidad>;
  abstract listar(): Promise<EstudianteEntidad[]>;
  abstract obtenerPorId(id: string): Promise<EstudianteEntidad | null>;
  abstract obtenerPorUsuarioId(usuarioId: string): Promise<EstudianteEntidad | null>;
  abstract existePorCodigoAnonimo(codigoAnonimo: string): Promise<boolean>;
  abstract contar(): Promise<number>;
}
