import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { EstudianteEntidad } from '../../dominio/entidades/estudiante.entidad';
import { RegistrarEstudianteDto } from '../dto/registrar-estudiante.dto';
import { RegistrarEstudianteCasoUso } from '../puertos/entrada/registrar-estudiante.caso-uso';
import { RepositorioEstudiantePuerto } from '../puertos/salida/repositorio-estudiante.puerto';

@Injectable()
export class RegistrarEstudianteServicio implements RegistrarEstudianteCasoUso {
  constructor(
    private readonly repositorioEstudiante: RepositorioEstudiantePuerto,
  ) {}

  async registrar(dto: RegistrarEstudianteDto): Promise<EstudianteEntidad> {
    const codigoAnonimo = dto.codigoAnonimo.trim().toUpperCase();
    const yaExiste = await this.repositorioEstudiante.existePorCodigoAnonimo(
      codigoAnonimo,
    );

    if (yaExiste) {
      throw new BadRequestException('El codigo anonimo ya existe');
    }

    return this.repositorioEstudiante.guardar(
      new EstudianteEntidad(null, null, codigoAnonimo, new Date()),
    );
  }

  listar(): Promise<EstudianteEntidad[]> {
    return this.repositorioEstudiante.listar();
  }

  obtenerPorId(id: string): Promise<EstudianteEntidad | null> {
    return this.repositorioEstudiante.obtenerPorId(id);
  }
}
