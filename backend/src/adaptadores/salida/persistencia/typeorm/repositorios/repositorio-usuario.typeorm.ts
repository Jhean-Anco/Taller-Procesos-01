import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepositorioUsuarioPuerto } from '../../../../../aplicacion/puertos/salida/repositorio-usuario.puerto';
import { UsuarioEntidad } from '../../../../../dominio/entidades/usuario.entidad';
import { UsuarioOrmEntidad } from '../entidades/usuario.orm-entidad';
import { UsuarioMapeador } from '../mapeadores/usuario.mapeador';

@Injectable()
export class RepositorioUsuarioTypeorm implements RepositorioUsuarioPuerto {
  constructor(
    @InjectRepository(UsuarioOrmEntidad)
    private readonly repositorio: Repository<UsuarioOrmEntidad>,
  ) {}

  async guardar(usuario: UsuarioEntidad): Promise<UsuarioEntidad> {
    const guardado = await this.repositorio.save(
      this.repositorio.create(UsuarioMapeador.aPersistencia(usuario)),
    );
    const usuarioCompleto = await this.repositorio.findOne({
      where: { id: guardado.id },
      relations: { estudiante: true },
    });
    return UsuarioMapeador.aDominio(usuarioCompleto ?? guardado);
  }

  async obtenerPorNombreUsuario(nombreUsuario: string): Promise<UsuarioEntidad | null> {
    const usuario = await this.repositorio.findOne({
      where: { nombreUsuario },
      relations: { estudiante: true },
    });
    return usuario ? UsuarioMapeador.aDominio(usuario) : null;
  }

  async obtenerPorId(id: string): Promise<UsuarioEntidad | null> {
    const usuario = await this.repositorio.findOne({
      where: { id },
      relations: { estudiante: true },
    });
    return usuario ? UsuarioMapeador.aDominio(usuario) : null;
  }

  existePorNombreUsuario(nombreUsuario: string): Promise<boolean> {
    return this.repositorio.existsBy({ nombreUsuario });
  }
}
