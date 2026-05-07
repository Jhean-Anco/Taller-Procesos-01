import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AplicacionModule } from './../src/aplicacion.module';
import { configurarAplicacion } from './../src/configurar-aplicacion';
import { ConvivenciaService } from './../src/contexts/convivencia/application/services/convivencia.service';
import { IaService } from './../src/contexts/ia/application/services/ia.service';
import { NivelAlerta } from './../src/contexts/convivencia/domain/enums/nivel-alerta.enum';
import { NivelEscolar } from './../src/contexts/convivencia/domain/enums/nivel-escolar.enum';
import { ResultadoIntervencion } from './../src/contexts/convivencia/domain/enums/resultado-intervencion.enum';
import { TipoIncidencia } from './../src/contexts/convivencia/domain/enums/tipo-incidencia.enum';
import { Rol } from './../src/shared/domain/enums/rol.enum';

interface RespuestaApi<T> {
  ok: boolean;
  data: T;
  meta: {
    path: string;
    timestamp: string;
  };
}

interface ReporteAnonimoE2E {
  id: string;
  nivelEscolar: NivelEscolar;
  tipoIncidencia: TipoIncidencia;
  nivelAlerta: NivelAlerta;
  alertaCritica: boolean;
}

interface IncidenciaE2E {
  id: string;
  nivelEscolar: NivelEscolar;
  tipoIncidencia: TipoIncidencia;
  nivelAlerta: NivelAlerta;
  estado: string;
  intervenciones: Array<{
    id: string;
    resultado: ResultadoIntervencion;
  }>;
}

interface EstadisticasE2E {
  totalReportesAnonimos: number;
  totalIncidencias: number;
  totalAlertasCriticas: number;
  incidenciasSecundaria: number;
}

interface MaterialDocenteE2E {
  id: string;
  titulo: string;
  creadoPor: string;
  temas: string[];
}

describe('Convivencia (e2e)', () => {
  let app: INestApplication<App>;
  let convivenciaService: ConvivenciaService;
  let iaService: IaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AplicacionModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configurarAplicacion(app);
    await app.init();
    convivenciaService = app.get(ConvivenciaService);
    iaService = app.get(IaService);
  });

  it('permite reportar anonimante y gestionar incidencias autenticadas', async () => {
    await convivenciaService.registrarUsuarioInstitucional({
      nombre: 'Psicologia Escolar',
      correo: 'psicologia@colegio.edu',
      rol: Rol.PSICOLOGO,
      area: 'Psicologia',
      password: 'ClaveSegura123',
    });

    const agente = request.agent(app.getHttpServer());

    await agente.post('/api/v1/auth/login').send({
      correo: 'psicologia@colegio.edu',
      password: 'ClaveSegura123',
    });

    const analizarCriticidadSpy = jest
      .spyOn(iaService, 'analizarCriticidad')
      .mockResolvedValue({
        nivelAlerta: NivelAlerta.MEDIA,
        alertaCritica: false,
        justificacion: 'Clasificacion simulada por IA',
      });

    const respuestaReporte = await request(app.getHttpServer())
      .post('/api/v1/convivencia/reportes-anonimos')
      .send({
        nivelEscolar: NivelEscolar.SECUNDARIA,
        grado: '3ro',
        seccion: 'B',
        tipoIncidencia: TipoIncidencia.HOSTIGAMIENTO_REITERADO,
        descripcion:
          'Se reportan burlas repetidas y aislamiento durante los recreos.',
      })
      .expect(201);

    const bodyReporte =
      respuestaReporte.body as RespuestaApi<ReporteAnonimoE2E>;

    expect(bodyReporte.ok).toBe(true);
    expect(bodyReporte.data.id).toEqual(expect.any(String));
    expect(bodyReporte.data.nivelEscolar).toBe(NivelEscolar.SECUNDARIA);
    expect(bodyReporte.data.tipoIncidencia).toBe(
      TipoIncidencia.HOSTIGAMIENTO_REITERADO,
    );
    expect(bodyReporte.data.alertaCritica).toBe(false);
    expect(bodyReporte.meta.path).toBe('/api/v1/convivencia/reportes-anonimos');

    const respuestaIncidencia = await agente
      .post('/api/v1/convivencia/incidencias/manual')
      .send({
        nivelEscolar: NivelEscolar.SECUNDARIA,
        grado: '3ro',
        seccion: 'B',
        tipoIncidencia: TipoIncidencia.BULLYING_VERBAL,
        descripcion:
          'Se detecto un patron grupal de agresion verbal en actividades de aula.',
      })
      .expect(201);

    const bodyIncidencia =
      respuestaIncidencia.body as RespuestaApi<IncidenciaE2E>;

    expect(bodyIncidencia.ok).toBe(true);
    expect(bodyIncidencia.data.id).toEqual(expect.any(String));
    expect(bodyIncidencia.data.estado).toBe('abierta');
    expect(bodyIncidencia.meta.path).toBe(
      '/api/v1/convivencia/incidencias/manual',
    );

    const incidenciaId = bodyIncidencia.data.id;

    const respuestaIntervencion = await agente
      .post(`/api/v1/convivencia/incidencias/${incidenciaId}/intervenciones`)
      .send({
        estrategia: 'Sesion grupal de mediacion con tutoria.',
        resultado: ResultadoIntervencion.PARCIAL,
        observaciones: 'Se mantiene seguimiento del clima del aula.',
      })
      .expect(201);

    const bodyIntervencion = respuestaIntervencion.body as RespuestaApi<{
      id: string;
      resultado: ResultadoIntervencion;
    }>;

    expect(bodyIntervencion.ok).toBe(true);
    expect(bodyIntervencion.data.id).toEqual(expect.any(String));
    expect(bodyIntervencion.data.resultado).toBe(ResultadoIntervencion.PARCIAL);
    expect(bodyIntervencion.meta.path).toBe(
      `/api/v1/convivencia/incidencias/${incidenciaId}/intervenciones`,
    );

    const respuestaEstadisticas = await agente
      .get('/api/v1/convivencia/estadisticas/clima-escolar')
      .expect(200);

    const bodyEstadisticas =
      respuestaEstadisticas.body as RespuestaApi<EstadisticasE2E>;

    expect(bodyEstadisticas.ok).toBe(true);
    expect(bodyEstadisticas.data.totalReportesAnonimos).toBe(1);
    expect(bodyEstadisticas.data.totalIncidencias).toBe(1);
    expect(bodyEstadisticas.data.incidenciasSecundaria).toBe(1);
    expect(bodyEstadisticas.meta.path).toBe(
      '/api/v1/convivencia/estadisticas/clima-escolar',
    );
    expect(analizarCriticidadSpy).toHaveBeenCalledTimes(2);
  });

  it('permite gestionar materiales docentes y endpoints de IA dentro de convivencia', async () => {
    await convivenciaService.registrarUsuarioInstitucional({
      nombre: 'Psicologia Escolar',
      correo: 'psicologia@colegio.edu',
      rol: Rol.PSICOLOGO,
      area: 'Psicologia',
      password: 'ClaveSegura123',
    });

    const agente = request.agent(app.getHttpServer());

    await agente.post('/api/v1/auth/login').send({
      correo: 'psicologia@colegio.edu',
      password: 'ClaveSegura123',
    });

    jest.spyOn(iaService, 'analizarCriticidad').mockResolvedValue({
      nivelAlerta: NivelAlerta.MEDIA,
      alertaCritica: false,
      justificacion: 'Clasificacion simulada por IA',
    });

    const generarTextoSpy = jest
      .spyOn(iaService, 'generarTexto')
      .mockResolvedValue({
        contenido: 'Respuesta simulada por IA',
        modelo: 'gpt-4.1-mini',
      });

    const respuestaMaterial = await agente
      .post('/api/v1/convivencia/materiales')
      .send({
        titulo: 'Guia de convivencia',
        descripcion: 'Material para docentes sobre senales tempranas.',
        contenido:
          '1. Observa cambios grupales. 2. Registra patrones. 3. Escala a psicologia.',
        temas: ['bullying', 'convivencia'],
        publicoObjetivo: 'docentes',
      })
      .expect(201);

    const bodyMaterial =
      respuestaMaterial.body as RespuestaApi<MaterialDocenteE2E>;

    expect(bodyMaterial.ok).toBe(true);
    expect(bodyMaterial.data.id).toEqual(expect.any(String));
    expect(bodyMaterial.data.titulo).toBe('Guia de convivencia');
    expect(bodyMaterial.data.temas).toEqual(['bullying', 'convivencia']);
    expect(bodyMaterial.meta.path).toBe('/api/v1/convivencia/materiales');

    const respuestaListaMateriales = await agente
      .get('/api/v1/convivencia/materiales')
      .expect(200);

    const bodyListaMateriales = respuestaListaMateriales.body as RespuestaApi<
      MaterialDocenteE2E[]
    >;

    expect(bodyListaMateriales.ok).toBe(true);
    expect(bodyListaMateriales.data).toHaveLength(1);
    expect(bodyListaMateriales.data[0]?.titulo).toBe('Guia de convivencia');

    const respuestaMaterialIa = await agente
      .post('/api/v1/convivencia/ia/materiales')
      .send({
        tema: 'Bullying verbal',
        nivelEscolar: 'Secundaria',
        objetivo: 'Apoyar a docentes tutores',
      })
      .expect(201);

    expect(
      respuestaMaterialIa.body as RespuestaApi<{ materialSugerido: string }>,
    ).toMatchObject({
      ok: true,
      data: {
        materialSugerido: 'Respuesta simulada por IA',
      },
      meta: {
        path: '/api/v1/convivencia/ia/materiales',
      },
    });

    const respuestaRecomendacionesIa = await agente
      .post('/api/v1/convivencia/ia/recomendaciones')
      .send({})
      .expect(201);

    expect(
      respuestaRecomendacionesIa.body as RespuestaApi<{
        recomendaciones: string;
      }>,
    ).toMatchObject({
      ok: true,
      data: {
        recomendaciones: 'Respuesta simulada por IA',
      },
      meta: {
        path: '/api/v1/convivencia/ia/recomendaciones',
      },
    });

    expect(generarTextoSpy).toHaveBeenCalledTimes(2);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    await app.close();
  });
});
