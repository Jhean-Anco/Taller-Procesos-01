import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepositorioEstudiantePuerto } from '../../../../../aplicacion/puertos/salida/repositorio-estudiante.puerto';
import { EstudianteEntidad } from '../../../../../dominio/entidades/estudiante.entidad';
import { EstudianteOrmEntidad } from '../entidades/estudiante.orm-entidad';
import { EstudianteMapeador } from '../mapeadores/estudiante.mapeador';

@Injectable()
export class RepositorioEstudianteTypeorm
  implements RepositorioEstudiantePuerto
{
  constructor(
    @InjectRepository(EstudianteOrmEntidad)
    private readonly repositorio: Repository<EstudianteOrmEntidad>,
  ) {}

  async guardar(estudiante: EstudianteEntidad): Promise<EstudianteEntidad> {
    const guardado = await this.repositorio.save(
      this.repositorio.create(EstudianteMapeador.aPersistencia(estudiante)),
    );
    return EstudianteMapeador.aDominio(guardado);
  }

  async listar(): Promise<EstudianteEntidad[]> {
    const estudiantes = await this.repositorio.find({
      order: { fechaCreacion: 'DESC' },
    });
    return estudiantes.map(EstudianteMapeador.aDominio);
  }

  async obtenerPorId(id: string): Promise<EstudianteEntidad | null> {
    const estudiante = await this.repositorio.findOneBy({ id });
    return estudiante ? EstudianteMapeador.aDominio(estudiante) : null;
  }

  async obtenerPorUsuarioId(usuarioId: string): Promise<EstudianteEntidad | null> {
    const estudiante = await this.repositorio.findOneBy({ usuarioId });
    return estudiante ? EstudianteMapeador.aDominio(estudiante) : null;
  }

  existePorCodigoAnonimo(codigoAnonimo: string): Promise<boolean> {
    return this.repositorio.existsBy({ codigoAnonimo });
  }

  contar(): Promise<number> {
    return this.repositorio.count();
  }
}
