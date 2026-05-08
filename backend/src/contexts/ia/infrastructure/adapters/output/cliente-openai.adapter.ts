import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { PuertoProveedorIa } from '../../../application/ports/output/proveedor-ia.port';
import { RespuestaIa } from '../../../domain/entities/respuesta-ia.entidad';

interface RespuestaOpenAi {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  model?: string;
  error?: {
    message?: string;
  };
}

@Injectable()
export class AdaptadorClienteOpenAi implements PuertoProveedorIa {
  constructor(private readonly configService: ConfigService) {}

  async generarTexto(prompt: string): Promise<RespuestaIa> {
    const apiKey = this.configService.get<string>('IA_API_KEY');
    const url = this.configService.get<string>('IA_API_URL');
    const modelo = this.configService.get<string>('IA_API_MODEL')!;

    if (!apiKey || !url) {
      throw new InternalServerErrorException(
        'La configuracion de IA no esta completa',
      );
    }

    // Se usa un contrato compatible con OpenAI para poder cambiar el backend de IA sin tocar el servicio.
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelo,
        messages: [
          {
            role: 'system',
            content: 'Responde de forma clara y breve en espanol.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    const data = (await response.json()) as RespuestaOpenAi;

    if (!response.ok) {
      throw new BadGatewayException(
        data.error?.message ??
          'No se pudo obtener respuesta del proveedor de IA',
      );
    }

    const contenido = data.choices?.[0]?.message?.content?.trim();

    // Se exige contenido útil para no propagar respuestas vacías al resto del sistema.
    if (!contenido) {
      throw new BadGatewayException(
        'El proveedor de IA respondio sin contenido util',
      );
    }

    return new RespuestaIa(contenido, data.model ?? modelo);
  }
}
