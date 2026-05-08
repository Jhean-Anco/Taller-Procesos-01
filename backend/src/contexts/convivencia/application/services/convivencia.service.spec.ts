import * as bcrypt from 'bcrypt';
import { Rol } from '../../../../shared/domain/enums/rol.enum';
import { NivelAlerta } from '../../domain/enums/nivel-alerta.enum';
import { NivelEscolar } from '../../domain/enums/nivel-escolar.enum';
import { TipoIncidencia } from '../../domain/enums/tipo-incidencia.enum';
import { ConvivenciaService } from './convivencia.service';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { IaService } from '../../../ia/application/services/ia.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('ConvivenciaService', () => {
  let service: ConvivenciaService;
  let repositorioConvivencia: jest.Mocked<RepositorioConvivencia>;
  let iaService: jest.Mocked<IaService>;
  let bcryptHashMock: jest.MockedFunction<typeof bcrypt.hash>;

  beforeEach(() => {
    repositorioConvivencia = {
      crearUsuarioInstitucional: jest.fn(),
      obtenerUsuarioAutenticablePorCorreo: jest.fn(),
      listarUsuariosInstitucionales: jest.fn(),
      crearReporteAnonimo: jest.fn(),
      listarReportesAnonimos: jest.fn(),
      crearIncidenciaDesdeReporte: jest.fn(),
      crearIncidenciaManual: jest.fn(),
      listarIncidencias: jest.fn(),
      agregarIntervencion: jest.fn(),
      crearMaterialDocente: jest.fn(),
      listarMaterialesDocentes: jest.fn(),
      registrarAtencionManual: jest.fn(),
      listarAlertasCriticas: jest.fn(),
      obtenerEstadisticasClimaEscolar: jest.fn(),
    };

    iaService = {
      analizarCriticidad: jest.fn(),
      generarTexto: jest.fn(),
    } as unknown as jest.Mocked<IaService>;

    service = new ConvivenciaService(repositorioConvivencia, iaService);
    bcryptHashMock = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>;
    bcryptHashMock.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('hashea la contrasena antes de registrar un usuario institucional', async () => {
    bcryptHashMock.mockResolvedValue('hash_generado' as never);
    repositorioConvivencia.crearUsuarioInstitucional.mockResolvedValue({
      id: 'usr_1',
      nombre: 'Ana Perez',
      correo: 'ana@colegio.edu',
      rol: Rol.ADMIN,
      area: 'Administracion',
      activo: true,
    });

    await service.registrarUsuarioInstitucional({
      nombre: 'Ana Perez',
      correo: 'ana@colegio.edu',
      rol: Rol.ADMIN,
      area: 'Administracion',
      password: 'ClaveSegura123',
    });

    expect(repositorioConvivencia.crearUsuarioInstitucional.mock.calls).toEqual(
      [
        [
          {
            nombre: 'Ana Perez',
            correo: 'ana@colegio.edu',
            rol: Rol.ADMIN,
            area: 'Administracion',
            password: 'hash_generado',
          },
        ],
      ],
    );
  });

  it('construye material docente con IA usando el prompt esperado', async () => {
    iaService.generarTexto.mockResolvedValue({
      contenido: 'Material sugerido por IA',
      modelo: 'gpt-4.1-mini',
    });

    await expect(
      service.generarMaterialIa({
        tema: 'Bullying verbal',
        nivelEscolar: 'Secundaria',
        objetivo: 'Capacitar a docentes tutores',
        rolSolicitante: Rol.PSICOLOGO,
      }),
    ).resolves.toEqual({
      materialSugerido: 'Material sugerido por IA',
    });

    const llamadaMaterial = iaService.generarTexto.mock.calls[0];

    expect(llamadaMaterial).toBeDefined();
    expect(llamadaMaterial?.[0]).toMatchObject({
      rolSolicitante: Rol.PSICOLOGO,
    });
    expect(llamadaMaterial?.[0].prompt).toContain('Tema: Bullying verbal');
  });

  it('usa la clasificacion de IA antes de registrar un reporte anonimo', async () => {
    iaService.analizarCriticidad.mockResolvedValue({
      nivelAlerta: NivelAlerta.ALTA,
      alertaCritica: true,
      justificacion: 'Clasificacion simulada por IA',
    });
    repositorioConvivencia.crearReporteAnonimo.mockResolvedValue({
      id: 'rep_1',
      fecha: '2026-04-23T12:00:00.000Z',
      nivelEscolar: NivelEscolar.SECUNDARIA,
      grado: '3ro',
      seccion: 'B',
      tipoIncidencia: TipoIncidencia.BULLYING_VERBAL,
      descripcion: 'Caso registrado',
      nivelAlerta: NivelAlerta.ALTA,
      alertaCritica: true,
      estado: 'escalado',
    } as never);

    await service.registrarReporteAnonimo({
      nivelEscolar: NivelEscolar.SECUNDARIA,
      grado: '3ro',
      seccion: 'B',
      tipoIncidencia: TipoIncidencia.BULLYING_VERBAL,
      descripcion: 'Caso registrado',
    });

    expect(iaService.analizarCriticidad.mock.calls).toEqual([
      [
        {
          origen: 'reporte_anonimo',
          nivelEscolar: NivelEscolar.SECUNDARIA,
          grado: '3ro',
          seccion: 'B',
          tipoIncidencia: TipoIncidencia.BULLYING_VERBAL,
          descripcion: 'Caso registrado',
        },
      ],
    ]);
    expect(repositorioConvivencia.crearReporteAnonimo.mock.calls).toEqual([
      [
        {
          nivelEscolar: NivelEscolar.SECUNDARIA,
          grado: '3ro',
          seccion: 'B',
          tipoIncidencia: TipoIncidencia.BULLYING_VERBAL,
          descripcion: 'Caso registrado',
          nivelAlerta: NivelAlerta.ALTA,
        },
      ],
    ]);
  });

  it('normaliza la criticidad con IA antes de registrar una atencion manual', async () => {
    iaService.analizarCriticidad.mockResolvedValue({
      nivelAlerta: NivelAlerta.MEDIA,
      alertaCritica: false,
      justificacion: 'Clasificacion simulada por IA',
    });
    repositorioConvivencia.registrarAtencionManual.mockResolvedValue({
      id: 'atm_1',
      fecha: '2026-04-23T12:00:00.000Z',
      nivelEscolar: NivelEscolar.PRIMARIA,
      grado: '5to',
      seccion: 'A',
      tipoIncidencia: TipoIncidencia.EXCLUSION_SOCIAL,
      descripcion: 'Caso grupal',
      observaciones: 'Seguimiento recomendado',
      atendidoPor: 'usr_1',
      nivelAlerta: NivelAlerta.MEDIA,
      alertaCritica: false,
    });

    await service.registrarAtencionManual({
      nivelEscolar: NivelEscolar.PRIMARIA,
      grado: '5to',
      seccion: 'A',
      tipoIncidencia: TipoIncidencia.EXCLUSION_SOCIAL,
      descripcion: 'Caso grupal',
      observaciones: 'Seguimiento recomendado',
      atendidoPor: 'usr_1',
    });

    expect(repositorioConvivencia.registrarAtencionManual.mock.calls).toEqual([
      [
        {
          nivelEscolar: NivelEscolar.PRIMARIA,
          grado: '5to',
          seccion: 'A',
          tipoIncidencia: TipoIncidencia.EXCLUSION_SOCIAL,
          descripcion: 'Caso grupal',
          observaciones: 'Seguimiento recomendado',
          atendidoPor: 'usr_1',
          nivelAlerta: NivelAlerta.MEDIA,
        },
      ],
    ]);
  });

  it('genera recomendaciones con base en las estadisticas actuales', async () => {
    repositorioConvivencia.obtenerEstadisticasClimaEscolar.mockResolvedValue({
      totalReportesAnonimos: 10,
      totalIncidencias: 5,
      totalAlertasCriticas: 1,
      totalAtencionesManuales: 2,
      incidenciasPrimaria: 2,
      incidenciasSecundaria: 3,
      tasaExitoIntervenciones: 60,
      incidenciasPorTipo: { bullying_verbal: 3 },
      indiceClimaEscolar: 74,
    });
    iaService.generarTexto.mockResolvedValue({
      contenido: 'Recomendaciones institucionales',
      modelo: 'gpt-4.1-mini',
    });

    await expect(
      service.generarRecomendacionesIa(Rol.ADMINISTRATIVO),
    ).resolves.toEqual({
      recomendaciones: 'Recomendaciones institucionales',
    });

    const llamadaRecomendaciones = iaService.generarTexto.mock.calls[0];

    expect(llamadaRecomendaciones).toBeDefined();
    expect(llamadaRecomendaciones?.[0]).toMatchObject({
      rolSolicitante: Rol.ADMINISTRATIVO,
    });
    expect(llamadaRecomendaciones?.[0].prompt).toContain(
      '"indiceClimaEscolar":74',
    );
  });
});
