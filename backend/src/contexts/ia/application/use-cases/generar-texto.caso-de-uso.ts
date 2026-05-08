import { Inject, Injectable } from '@nestjs/common';
import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import { RespuestaIa } from '../../domain/entities/respuesta-ia.entidad';
import { PUERTO_PROVEEDOR_IA } from '../ports/output/proveedor-ia.port';
import type { PuertoProveedorIa } from '../ports/output/proveedor-ia.port';
import { REPOSITORIO_REGISTRO_SOLICITUD } from '../ports/output/registro-solicitud.repository';
import type { RepositorioRegistroSolicitud } from '../ports/output/registro-solicitud.repository';

export interface ComandoGenerarTexto {
  prompt: string;
  rolSolicitante: string;
}

@Injectable()
export class GenerarTextoCasoDeUso implements CasoDeUso<
  Promise<RespuestaIa>,
  [ComandoGenerarTexto]
> {
  constructor(
    @Inject(PUERTO_PROVEEDOR_IA)
    private readonly proveedorIa: PuertoProveedorIa,
    @Inject(REPOSITORIO_REGISTRO_SOLICITUD)
    private readonly repositorioRegistroSolicitud: RepositorioRegistroSolicitud,
  ) {}

  async ejecutar(command: ComandoGenerarTexto): Promise<RespuestaIa> {
    const respuesta = await this.proveedorIa.generarTexto(command.prompt);

    await this.repositorioRegistroSolicitud.crear({
      prompt: command.prompt,
      respuesta: respuesta.contenido,
      modelo: respuesta.modelo,
      rolSolicitante: command.rolSolicitante,
    });

    return respuesta;
  }
}
