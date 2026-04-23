import { RepositorioRegistroSolicitudMemoria } from './registro-solicitud-memoria.repository';

type RepositorioConRegistros = RepositorioRegistroSolicitudMemoria & {
  registros: Array<{
    prompt: string;
    respuesta: string;
    modelo: string;
    rolSolicitante: string;
  }>;
};

function obtenerRegistros(
  repository: RepositorioRegistroSolicitudMemoria,
): RepositorioConRegistros['registros'] {
  return Reflect.get(
    repository,
    'registros',
  ) as RepositorioConRegistros['registros'];
}

describe('RepositorioRegistroSolicitudMemoria', () => {
  let repository: RepositorioRegistroSolicitudMemoria;

  beforeEach(() => {
    repository = new RepositorioRegistroSolicitudMemoria();
  });

  it('almacena cada solicitud generada por IA en memoria', async () => {
    await repository.crear({
      prompt: 'Genera una guia para docentes.',
      respuesta: 'Guia generada',
      modelo: 'gpt-4.1-mini',
      rolSolicitante: 'docente',
    });

    await repository.crear({
      prompt: 'Genera recomendaciones institucionales.',
      respuesta: 'Recomendaciones generadas',
      modelo: 'gpt-4.1-mini',
      rolSolicitante: 'psicologo',
    });

    const registros = obtenerRegistros(repository);

    expect(registros).toHaveLength(2);
    expect(registros[0]).toMatchObject({
      prompt: 'Genera una guia para docentes.',
      respuesta: 'Guia generada',
      modelo: 'gpt-4.1-mini',
      rolSolicitante: 'docente',
    });
    expect(registros[1]).toMatchObject({
      prompt: 'Genera recomendaciones institucionales.',
      respuesta: 'Recomendaciones generadas',
      modelo: 'gpt-4.1-mini',
      rolSolicitante: 'psicologo',
    });
  });
});
