import { IaService } from './ia.service';

describe('IaService', () => {
  let service: IaService;
  let proveedorIa: {
    generarTexto: jest.Mock;
  };
  let repositorioRegistroSolicitud: {
    crear: jest.Mock;
  };

  beforeEach(() => {
    proveedorIa = {
      generarTexto: jest.fn(),
    };
    repositorioRegistroSolicitud = {
      crear: jest.fn(),
    };

    service = new IaService(proveedorIa, repositorioRegistroSolicitud);
  });

  it('parsea la respuesta JSON de criticidad devuelta por la IA', async () => {
    proveedorIa.generarTexto.mockResolvedValue({
      contenido:
        '{"nivelAlerta":"alta","alertaCritica":true,"justificacion":"Existe riesgo de escalamiento institucional."}',
      modelo: 'gpt-4.1-mini',
    });

    await expect(
      service.analizarCriticidad({
        origen: 'reporte_anonimo',
        nivelEscolar: 'secundaria',
        grado: '3ro',
        seccion: 'B',
        tipoIncidencia: 'hostigamiento_reiterado',
        descripcion: 'Caso grupal persistente en recreo.',
      }),
    ).resolves.toEqual({
      nivelAlerta: 'alta',
      alertaCritica: true,
      justificacion: 'Existe riesgo de escalamiento institucional.',
    });
  });

  it('registra la solicitud al generar texto libre', async () => {
    proveedorIa.generarTexto.mockResolvedValue({
      contenido: 'Respuesta generada',
      modelo: 'gpt-4.1-mini',
    });

    await expect(
      service.generarTexto({
        prompt: 'Genera una guia breve.',
        rolSolicitante: 'docente',
      }),
    ).resolves.toEqual({
      contenido: 'Respuesta generada',
      modelo: 'gpt-4.1-mini',
    });

    expect(repositorioRegistroSolicitud.crear.mock.calls).toEqual([
      [
        {
          prompt: 'Genera una guia breve.',
          respuesta: 'Respuesta generada',
          modelo: 'gpt-4.1-mini',
          rolSolicitante: 'docente',
        },
      ],
    ]);
  });
});
