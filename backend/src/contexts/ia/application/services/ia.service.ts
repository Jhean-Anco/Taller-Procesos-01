import { Inject, Injectable } from '@nestjs/common';
import { PUERTO_PROVEEDOR_IA } from '../ports/output/proveedor-ia.port';
import type { PuertoProveedorIa } from '../ports/output/proveedor-ia.port';
import { REPOSITORIO_REGISTRO_SOLICITUD } from '../ports/output/registro-solicitud.repository';
import type { RepositorioRegistroSolicitud } from '../ports/output/registro-solicitud.repository';
import { AnalisisCriticidadIa } from '../../domain/entities/analisis-criticidad-ia.entidad';
import { RespuestaIa } from '../../domain/entities/respuesta-ia.entidad';
import { NivelAlerta } from '../../../convivencia/domain/enums/nivel-alerta.enum';

export interface SolicitudGeneracionTexto {
  prompt: string;
  rolSolicitante: string;
}

export interface SolicitudAnalisisCriticidad {
  origen: 'reporte_anonimo' | 'incidencia_manual' | 'atencion_manual';
  nivelEscolar: string;
  grado: string;
  seccion: string;
  tipoIncidencia: string;
  descripcion: string;
  observaciones?: string;
}

@Injectable()
export class IaService {
  constructor(
    @Inject(PUERTO_PROVEEDOR_IA)
    private readonly puertoProveedorIa: PuertoProveedorIa,
    @Inject(REPOSITORIO_REGISTRO_SOLICITUD)
    private readonly repositorioRegistroSolicitud: RepositorioRegistroSolicitud,
  ) {}

  async generarTexto({
    prompt,
    rolSolicitante,
  }: SolicitudGeneracionTexto): Promise<RespuestaIa> {
    // La generación se delega al puerto externo y luego se registra para trazabilidad institucional.
    const respuesta = await this.puertoProveedorIa.generarTexto(prompt);

    await this.repositorioRegistroSolicitud.crear({
      prompt,
      respuesta: respuesta.contenido,
      modelo: respuesta.modelo,
      rolSolicitante,
    });

    return respuesta;
  }

  async analizarCriticidad(
    solicitud: SolicitudAnalisisCriticidad,
  ): Promise<AnalisisCriticidadIa> {
    // La IA actúa como capa intermedia: recibe el caso bruto y devuelve una clasificación operativa.
    const respuesta = await this.generarTexto({
      prompt: `Analiza el siguiente caso institucional de convivencia escolar.
Debes responder solo JSON valido con esta forma exacta:
{"nivelAlerta":"baja|media|alta|critica","alertaCritica":true|false,"justificacion":"texto breve"}

Reglas:
- Evalua criticidad institucional y urgencia de seguimiento.
- No inventes identidades ni datos sensibles.
- Usa "critica" solo si requiere accion inmediata institucional.

Caso:
${JSON.stringify(solicitud, null, 2)}`,
      rolSolicitante: 'sistema_clasificacion_criticidad',
    });

    return this.parsearAnalisisCriticidad(respuesta.contenido);
  }

  private parsearAnalisisCriticidad(contenido: string): AnalisisCriticidadIa {
    const jsonCrudo = this.extraerBloqueJson(contenido);
    const analisis = JSON.parse(jsonCrudo) as {
      nivelAlerta?: string;
      alertaCritica?: boolean;
      justificacion?: string;
    };

    const nivelAlerta = analisis.nivelAlerta?.toLowerCase() as
      | NivelAlerta
      | undefined;

    if (!nivelAlerta || !Object.values(NivelAlerta).includes(nivelAlerta)) {
      throw new Error('La IA no devolvio un nivel de alerta valido');
    }

    return new AnalisisCriticidadIa(
      nivelAlerta,
      analisis.alertaCritica ?? nivelAlerta === NivelAlerta.CRITICA,
      analisis.justificacion?.trim() || 'Clasificacion generada por IA',
    );
  }

  private extraerBloqueJson(contenido: string): string {
    const contenidoRecortado = contenido.trim();

    if (
      contenidoRecortado.startsWith('{') &&
      contenidoRecortado.endsWith('}')
    ) {
      return contenidoRecortado;
    }

    const coincidencia = contenidoRecortado.match(/\{[\s\S]*\}/);

    if (!coincidencia) {
      throw new Error('La IA no devolvio un JSON interpretable');
    }

    return coincidencia[0];
  }
}
