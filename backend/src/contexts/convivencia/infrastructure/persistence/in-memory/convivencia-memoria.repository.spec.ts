import { NotFoundException } from '@nestjs/common';
import { Rol } from '../../../../../shared/domain/enums/rol.enum';
import { EstadoIncidencia } from '../../../domain/enums/estado-incidencia.enum';
import { NivelAlerta } from '../../../domain/enums/nivel-alerta.enum';
import { NivelEscolar } from '../../../domain/enums/nivel-escolar.enum';
import { ResultadoIntervencion } from '../../../domain/enums/resultado-intervencion.enum';
import { TipoIncidencia } from '../../../domain/enums/tipo-incidencia.enum';
import { RepositorioConvivenciaMemoria } from './convivencia-memoria.repository';

describe('RepositorioConvivenciaMemoria', () => {
  let repository: RepositorioConvivenciaMemoria;

  beforeEach(() => {
    repository = new RepositorioConvivenciaMemoria();
  });

  it('registra usuarios institucionales y permite buscarlos por correo sin importar mayusculas', async () => {
    const usuario = await repository.crearUsuarioInstitucional({
      nombre: 'Psicologia Escolar',
      correo: 'Psicologia@Colegio.edu',
      rol: Rol.PSICOLOGO,
      area: 'Psicologia',
      password: 'hash_guardado',
    });

    const autenticable = await repository.obtenerUsuarioAutenticablePorCorreo(
      'psicologia@colegio.edu',
    );

    expect(usuario.correo).toBe('Psicologia@Colegio.edu');
    expect(autenticable).toMatchObject({
      id: usuario.id,
      nombre: 'Psicologia Escolar',
      correo: 'Psicologia@Colegio.edu',
      rol: Rol.PSICOLOGO,
      activo: true,
      passwordHash: 'hash_guardado',
    });
  });

  it('marca reportes e incidencias criticas cuando corresponde', async () => {
    const reporte = await repository.crearReporteAnonimo({
      nivelEscolar: NivelEscolar.SECUNDARIA,
      grado: '3ro',
      seccion: 'B',
      tipoIncidencia: TipoIncidencia.AGRESION_FISICA,
      descripcion: 'Se reporta agresion fisica reiterada en recreo.',
      nivelAlerta: NivelAlerta.ALTA,
    });

    const incidencia = await repository.crearIncidenciaManual({
      nivelEscolar: NivelEscolar.SECUNDARIA,
      grado: '3ro',
      seccion: 'B',
      tipoIncidencia: TipoIncidencia.AGRESION_FISICA,
      descripcion: 'Caso manual de agresion fisica observado por el equipo.',
      nivelAlerta: NivelAlerta.ALTA,
    });

    expect(reporte.alertaCritica).toBe(true);
    expect(reporte.estado).toBe('escalado');
    expect(incidencia.alertaCritica).toBe(true);

    await expect(repository.listarAlertasCriticas()).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: incidencia.id,
          alertaCritica: true,
        }),
      ]),
    );
  });

  it('actualiza el estado de la incidencia al agregar intervenciones', async () => {
    const incidencia = await repository.crearIncidenciaManual({
      nivelEscolar: NivelEscolar.PRIMARIA,
      grado: '5to',
      seccion: 'A',
      tipoIncidencia: TipoIncidencia.EXCLUSION_SOCIAL,
      descripcion: 'Se registra exclusion social grupal en aula.',
      nivelAlerta: NivelAlerta.MEDIA,
    });

    await repository.agregarIntervencion(incidencia.id, {
      estrategia: 'Sesion grupal de mediacion',
      responsableId: 'usr_1',
      responsableRol: Rol.PSICOLOGO,
      resultado: ResultadoIntervencion.PARCIAL,
      observaciones: 'Se mantiene monitoreo posterior.',
    });

    const incidenciasTrasParcial = await repository.listarIncidencias();

    expect(incidenciasTrasParcial[0]).toMatchObject({
      id: incidencia.id,
      estado: EstadoIncidencia.EN_SEGUIMIENTO,
    });
    expect(incidenciasTrasParcial[0]?.intervenciones).toHaveLength(1);

    await repository.agregarIntervencion(incidencia.id, {
      estrategia: 'Cierre de seguimiento con tutoria',
      responsableId: 'usr_1',
      responsableRol: Rol.PSICOLOGO,
      resultado: ResultadoIntervencion.EXITOSO,
      observaciones: 'Se resuelve la situacion grupal.',
    });

    const incidenciasTrasExito = await repository.listarIncidencias();

    expect(incidenciasTrasExito[0]).toMatchObject({
      id: incidencia.id,
      estado: EstadoIncidencia.CERRADA,
    });
    expect(incidenciasTrasExito[0]?.intervenciones).toHaveLength(2);
  });

  it('lanza error si se intenta intervenir una incidencia inexistente', () => {
    expect(() =>
      repository.agregarIntervencion('inc_inexistente', {
        estrategia: 'Sesion',
        responsableId: 'usr_1',
        responsableRol: Rol.PSICOLOGO,
        resultado: ResultadoIntervencion.PENDIENTE,
        observaciones: 'Sin hallazgos',
      }),
    ).toThrow(NotFoundException);
  });

  it('calcula estadisticas de clima escolar a partir de incidencias e intervenciones', async () => {
    await repository.crearReporteAnonimo({
      nivelEscolar: NivelEscolar.PRIMARIA,
      grado: '5to',
      seccion: 'A',
      tipoIncidencia: TipoIncidencia.EXCLUSION_SOCIAL,
      descripcion: 'Se reporta exclusion en dinamicas de grupo.',
      nivelAlerta: NivelAlerta.MEDIA,
    });

    const incidenciaPrimaria = await repository.crearIncidenciaManual({
      nivelEscolar: NivelEscolar.PRIMARIA,
      grado: '5to',
      seccion: 'A',
      tipoIncidencia: TipoIncidencia.EXCLUSION_SOCIAL,
      descripcion: 'Incidencia manual en primaria.',
      nivelAlerta: NivelAlerta.MEDIA,
    });

    const incidenciaSecundaria = await repository.crearIncidenciaManual({
      nivelEscolar: NivelEscolar.SECUNDARIA,
      grado: '3ro',
      seccion: 'B',
      tipoIncidencia: TipoIncidencia.BULLYING_VERBAL,
      descripcion: 'Incidencia manual en secundaria.',
      nivelAlerta: NivelAlerta.ALTA,
    });

    await repository.agregarIntervencion(incidenciaPrimaria.id, {
      estrategia: 'Acompañamiento grupal',
      responsableId: 'usr_1',
      responsableRol: Rol.PSICOLOGO,
      resultado: ResultadoIntervencion.EXITOSO,
      observaciones: 'Buena respuesta del grupo.',
    });

    await repository.agregarIntervencion(incidenciaSecundaria.id, {
      estrategia: 'Seguimiento de aula',
      responsableId: 'usr_2',
      responsableRol: Rol.DOCENTE,
      resultado: ResultadoIntervencion.PARCIAL,
      observaciones: 'Se requiere monitoreo continuo.',
    });

    const estadisticas = await repository.obtenerEstadisticasClimaEscolar();

    expect(estadisticas.totalReportesAnonimos).toBe(1);
    expect(estadisticas.totalIncidencias).toBe(2);
    expect(estadisticas.incidenciasPrimaria).toBe(1);
    expect(estadisticas.incidenciasSecundaria).toBe(1);
    expect(estadisticas.tasaExitoIntervenciones).toBe(50);
    expect(estadisticas.incidenciasPorTipo).toMatchObject({
      exclusion_social: 1,
      bullying_verbal: 1,
    });
  });
});
