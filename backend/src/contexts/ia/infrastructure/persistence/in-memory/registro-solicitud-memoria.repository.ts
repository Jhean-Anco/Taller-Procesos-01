import { Injectable } from '@nestjs/common';
import type {
  CrearRegistroSolicitud,
  RepositorioRegistroSolicitud,
} from '../../../application/ports/output/registro-solicitud.repository';

@Injectable()
export class RepositorioRegistroSolicitudMemoria implements RepositorioRegistroSolicitud {
  private readonly registros: CrearRegistroSolicitud[] = [];

  crear(data: CrearRegistroSolicitud): Promise<void> {
    this.registros.push(data);
    return Promise.resolve();
  }
}
