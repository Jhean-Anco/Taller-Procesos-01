import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  CrearRegistroSolicitud,
  RepositorioRegistroSolicitud,
} from '../../../../application/ports/output/registro-solicitud.repository';
import { RegistroSolicitudOrmEntidad } from '../entities/registro-solicitud.orm-entidad';

@Injectable()
export class RepositorioRegistroSolicitudTypeOrm implements RepositorioRegistroSolicitud {
  constructor(
    @InjectRepository(RegistroSolicitudOrmEntidad)
    private readonly repository: Repository<RegistroSolicitudOrmEntidad>,
  ) {}

  async crear(data: CrearRegistroSolicitud): Promise<void> {
    const entity = this.repository.create(data);
    await this.repository.save(entity);
  }
}
