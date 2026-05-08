import { Test, TestingModule } from '@nestjs/testing';
import { ConvivenciaService } from '../../../../application/services/convivencia.service';
import { ConvivenciaControlador } from './convivencia.controller';
import { Rol } from '../../../../../../shared/domain/enums/rol.enum';

describe('ConvivenciaControlador', () => {
  let controller: ConvivenciaControlador;
  let convivenciaService: jest.Mocked<ConvivenciaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConvivenciaControlador],
      providers: [
        {
          provide: ConvivenciaService,
          useValue: {
            registrarUsuarioInstitucional: jest.fn(),
            listarUsuariosInstitucionales: jest.fn(),
            registrarReporteAnonimo: jest.fn(),
            crearIncidenciaDesdeReporte: jest.fn(),
            crearIncidenciaManual: jest.fn(),
            listarIncidencias: jest.fn(),
            agregarIntervencion: jest.fn(),
            crearMaterialDocente: jest.fn(),
            listarMaterialesDocentes: jest.fn(),
            registrarAtencionManual: jest.fn(),
            listarAlertasCriticas: jest.fn(),
            obtenerEstadisticasClimaEscolar: jest.fn(),
            generarMaterialIa: jest.fn(),
            generarRecomendacionesIa: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ConvivenciaControlador>(ConvivenciaControlador);
    convivenciaService = module.get(ConvivenciaService);
  });

  it('agrega responsableId y responsableRol al registrar una intervencion', async () => {
    convivenciaService.agregarIntervencion.mockResolvedValue({
      id: 'int_1',
      fecha: '2026-04-23T12:00:00.000Z',
      estrategia: 'Sesion grupal',
      responsableId: 'usr_1',
      responsableRol: Rol.PSICOLOGO,
      resultado: 'parcial',
      observaciones: 'Seguimiento activo',
    } as never);

    await controller.agregarIntervencion(
      'inc_1',
      {
        estrategia: 'Sesion grupal',
        resultado: 'parcial' as never,
        observaciones: 'Seguimiento activo',
      },
      {
        usuario: {
          id: 'usr_1',
          nombre: 'Psicologia Escolar',
          correo: 'psicologia@colegio.edu',
          rol: Rol.PSICOLOGO,
        },
      } as never,
    );

    expect(convivenciaService.agregarIntervencion.mock.calls).toEqual([
      [
        'inc_1',
        {
          estrategia: 'Sesion grupal',
          resultado: 'parcial',
          observaciones: 'Seguimiento activo',
          responsableId: 'usr_1',
          responsableRol: Rol.PSICOLOGO,
        },
      ],
    ]);
  });

  it('usa el id del usuario autenticado al crear material docente', async () => {
    convivenciaService.crearMaterialDocente.mockResolvedValue({
      id: 'mat_1',
      titulo: 'Guia',
      descripcion: 'Descripcion',
      contenido: 'Contenido',
      creadoPor: 'usr_2',
      temas: ['bullying'],
      publicoObjetivo: 'docentes',
      fecha: '2026-04-23T12:00:00.000Z',
    } as never);

    await controller.crearMaterialDocente(
      {
        titulo: 'Guia',
        descripcion: 'Descripcion amplia',
        contenido: 'Contenido suficientemente largo para validacion',
        temas: ['bullying'],
        publicoObjetivo: 'docentes',
      },
      {
        usuario: {
          id: 'usr_2',
          nombre: 'Admin',
          correo: 'admin@colegio.edu',
          rol: Rol.ADMIN,
        },
      } as never,
    );

    expect(convivenciaService.crearMaterialDocente.mock.calls).toEqual([
      [
        {
          titulo: 'Guia',
          descripcion: 'Descripcion amplia',
          contenido: 'Contenido suficientemente largo para validacion',
          temas: ['bullying'],
          publicoObjetivo: 'docentes',
          creadoPor: 'usr_2',
        },
      ],
    ]);
  });

  it('usa el rol autenticado al solicitar recomendaciones con IA', async () => {
    convivenciaService.generarRecomendacionesIa.mockResolvedValue({
      recomendaciones: 'Recomendaciones',
    });

    await expect(
      controller.generarRecomendacionesIa({
        usuario: {
          id: 'usr_3',
          nombre: 'Docente Tutor',
          correo: 'docente@colegio.edu',
          rol: Rol.DOCENTE,
        },
      } as never),
    ).resolves.toEqual({
      recomendaciones: 'Recomendaciones',
    });

    expect(convivenciaService.generarRecomendacionesIa.mock.calls).toEqual([
      [Rol.DOCENTE],
    ]);
  });
});
