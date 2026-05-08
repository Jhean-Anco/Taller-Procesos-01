import { BadRequestException } from '@nestjs/common';
import { AlertaEntidad } from '../../dominio/entidades/alerta.entidad';
import { AvanceProcesoAdministrativoEntidad } from '../../dominio/entidades/avance-proceso-administrativo.entidad';
import { ProcesoAdministrativoEntidad } from '../../dominio/entidades/proceso-administrativo.entidad';
import { HistoriaAlertaDto } from '../dto/historia-alerta.dto';
import { UsuarioAutenticadoDto } from '../dto/usuario-autenticado.dto';
import { RepositorioAlertaPuerto } from '../puertos/salida/repositorio-alerta.puerto';
import { RepositorioAvanceProcesoAdministrativoPuerto } from '../puertos/salida/repositorio-avance-proceso-administrativo.puerto';
import { RepositorioProcesoAdministrativoPuerto } from '../puertos/salida/repositorio-proceso-administrativo.puerto';
import { IncidenciasAdministrativasServicio } from './incidencias-administrativas.servicio';

const alerta = new AlertaEntidad(
  'alerta-1',
  'encuesta-1',
  'estudiante-1',
  'psicologo-1',
  85,
  'evaluacion',
  'IA ALTO RIESGO. Revision humana requerida.',
  new Date(),
  new Date(),
);

const usuarioAdministrativo: UsuarioAutenticadoDto = {
  usuarioId: 'admin-1',
  nombreUsuario: 'ADMIN01',
  rol: 'administrativo',
  estudianteId: null,
};

class RepositorioAlertaMemoria implements RepositorioAlertaPuerto {
  constructor(private readonly tieneSeguimiento: boolean) {}

  async guardar(alertaParaGuardar: AlertaEntidad): Promise<AlertaEntidad> {
    return alertaParaGuardar;
  }

  async listar(): Promise<AlertaEntidad[]> {
    return [alerta];
  }

  async listarEscaladasParaAdministracion(): Promise<AlertaEntidad[]> {
    return this.tieneSeguimiento ? [alerta] : [];
  }

  async obtenerPorId(): Promise<AlertaEntidad | null> {
    return alerta;
  }

  async obtenerHistoriaPorId(): Promise<HistoriaAlertaDto | null> {
    return {
      alerta: {
        id: alerta.id as string,
        estudianteId: alerta.estudianteId,
        encuestaId: alerta.encuestaId,
        puntajeRiesgo: alerta.puntajeRiesgo,
        estado: alerta.estado,
        mensajeEtico: alerta.mensajeEtico,
        psicologoAsignadoId: alerta.psicologoAsignadoId,
        fechaCreacion: alerta.fechaCreacion,
        ultimaActualizacion: alerta.ultimaActualizacion,
      },
      encuesta: {
        textoEmocional: 'Tengo miedo y recibo insultos',
        nivelAnimo: 2,
        nivelSeguridad: 2,
        puntajeRiesgo: 85,
        grado: 1,
        zonaJunin: 1,
        recreoSolo: 1,
        animoManana: 1,
        miedoParticipar: 1,
        redesSociales: 0,
        apoyoFamiliar: 0,
        rendimiento: 1,
        habilidadesSociales: 0,
        entornoViolento: 1,
        evaluacionIaDisponible: true,
        nivelRiesgoIa: 'ALTO RIESGO',
        prioridadAtencionIa: 'alta',
        analisisPsicologicoIa: 'Alerta psicologica.',
        accionRecomendadaIa: 'Derivar a alta directiva.',
        factoresDetectadosIa: ['relato con carga emocional negativa'],
        factoresProtectoresIa: [],
        prediccionArbol: 1,
        sentimientoTextoIa: 'NEG',
        confianzaTextoIa: 0.96,
        confianzaGlobalIa: 0.98,
        fechaCreacion: new Date(),
      },
      seguimientos: this.tieneSeguimiento
        ? [
            {
              id: 'seguimiento-1',
              psicologoId: 'psicologo-1',
              accionGlobal: 'Entrevista de contencion',
              descripcion: 'Derivar accion institucional preventiva.',
              fechaCreacion: new Date(),
            },
          ]
        : [],
      procesosAdministrativos: [],
    };
  }

  async contar(): Promise<number> {
    return 1;
  }

  async contarPorEstado(): Promise<number> {
    return 1;
  }

  async contarPorRiesgoMinimo(): Promise<number> {
    return 1;
  }

  async contarEscaladasParaAdministracion(): Promise<number> {
    return this.tieneSeguimiento ? 1 : 0;
  }
}

class RepositorioProcesoMemoria
  implements RepositorioProcesoAdministrativoPuerto
{
  public procesoGuardado: ProcesoAdministrativoEntidad | null = null;

  async guardar(
    proceso: ProcesoAdministrativoEntidad,
  ): Promise<ProcesoAdministrativoEntidad> {
    this.procesoGuardado = proceso;
    return new ProcesoAdministrativoEntidad(
      'proceso-1',
      proceso.alertaId,
      proceso.administrativoId,
      proceso.accionInstitucional,
      proceso.descripcionInicial,
      proceso.responsable,
      proceso.fechaObjetivo,
      proceso.estado,
      proceso.fechaCreacion,
      proceso.fechaActualizacion,
    );
  }

  async obtenerPorId(): Promise<ProcesoAdministrativoEntidad | null> {
    return null;
  }

  async listarPorAlerta(): Promise<ProcesoAdministrativoEntidad[]> {
    return [];
  }

  async contar(): Promise<number> {
    return 0;
  }

  async contarPorEstado(): Promise<number> {
    return 0;
  }
}

class RepositorioAvanceMemoria
  implements RepositorioAvanceProcesoAdministrativoPuerto
{
  async guardar(
    avance: AvanceProcesoAdministrativoEntidad,
  ): Promise<AvanceProcesoAdministrativoEntidad> {
    return avance;
  }

  async listarPorProceso(): Promise<AvanceProcesoAdministrativoEntidad[]> {
    return [];
  }

  async contar(): Promise<number> {
    return 0;
  }
}

describe('IncidenciasAdministrativasServicio', () => {
  it('bloquea proceso administrativo si psicologia aun no derivo la incidencia', async () => {
    const servicio = new IncidenciasAdministrativasServicio(
      new RepositorioAlertaMemoria(false),
      new RepositorioProcesoMemoria(),
      new RepositorioAvanceMemoria(),
    );

    await expect(
      servicio.registrarProceso(
        'alerta-1',
        {
          accionInstitucional: 'Supervision de patio',
          descripcionInicial: 'Coordinar supervision preventiva del caso.',
          estado: 'pendiente',
        },
        usuarioAdministrativo,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('registra proceso administrativo cuando ya existe seguimiento psicologico', async () => {
    const repositorioProceso = new RepositorioProcesoMemoria();
    const servicio = new IncidenciasAdministrativasServicio(
      new RepositorioAlertaMemoria(true),
      repositorioProceso,
      new RepositorioAvanceMemoria(),
    );

    await servicio.registrarProceso(
      'alerta-1',
      {
        accionInstitucional: 'Supervision de patio',
        descripcionInicial: 'Coordinar supervision preventiva del caso.',
        estado: 'en_proceso',
      },
      usuarioAdministrativo,
    );

    expect(repositorioProceso.procesoGuardado).not.toBeNull();
    expect(repositorioProceso.procesoGuardado?.administrativoId).toBe('admin-1');
  });
});
