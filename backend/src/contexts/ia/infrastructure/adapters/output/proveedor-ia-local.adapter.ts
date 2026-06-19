import { Injectable } from '@nestjs/common';
import type { PuertoProveedorIa } from '../../../application/ports/output/proveedor-ia.port';
import { RespuestaIa } from '../../../domain/entities/respuesta-ia.entidad';

@Injectable()
export class AdaptadorProveedorIaLocal implements PuertoProveedorIa {
  generarTexto(prompt: string): Promise<RespuestaIa> {
    const texto = prompt.toLowerCase();
    const nivelAlerta =
      texto.includes('suicidio') || texto.includes('abuso')
        ? 'critica'
        : texto.includes('golpe') || texto.includes('amenaza')
          ? 'alta'
          : texto.includes('miedo') ||
              texto.includes('burla') ||
              texto.includes('aislamiento')
            ? 'media'
            : 'baja';
    const contenido = JSON.stringify({
      nivelAlerta,
      alertaCritica: nivelAlerta === 'critica',
      justificacion:
        'Clasificacion local preliminar basada en reglas; requiere validacion humana.',
    });
    return Promise.resolve(new RespuestaIa(contenido, 'local-rules-provider'));
  }
}
