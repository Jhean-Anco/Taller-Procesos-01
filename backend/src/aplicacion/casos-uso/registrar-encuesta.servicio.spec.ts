import { AlertaEntidad } from '../../dominio/entidades/alerta.entidad';
import { EncuestaEmocionalEntidad } from '../../dominio/entidades/encuesta-emocional.entidad';
import { EstudianteEntidad } from '../../dominio/entidades/estudiante.entidad';
import { CalculadorRiesgoServicio } from '../../dominio/servicios/calculador-riesgo.servicio';
import { RegistrarEncuestaServicio } from './registrar-encuesta.servicio';
import { RepositorioAlertaPuerto } from '../puertos/salida/repositorio-alerta.puerto';
import { RepositorioEncuestaPuerto } from '../puertos/salida/repositorio-encuesta.puerto';
import { RepositorioEstudiantePuerto } from '../puertos/salida/repositorio-estudiante.puerto';
import {
  EvaluadorRiesgoIaPuerto,
  ResultadoEvaluacionRiesgoIa,
  SolicitudEvaluacionRiesgoIa,
} from '../puertos/salida/evaluador-riesgo-ia.puerto';

class RepositorioEstudianteMemoria implements RepositorioEstudiantePuerto {
  async guardar(estudiante: EstudianteEntidad): Promise<EstudianteEntidad> {
    return new EstudianteEntidad(
      'estudiante-1',
      estudiante.usuarioId,
      estudiante.codigoAnonimo,
      estudiante.fechaCreacion,
    );
  }
  async listar(): Promise<EstudianteEntidad[]> {
    return [];
  }
  async obtenerPorId(): Promise<EstudianteEntidad | null> {
    return null;
  }
  async obtenerPorUsuarioId(): Promise<EstudianteEntidad | null> {
    return null;
  }
  async existePorCodigoAnonimo(): Promise<boolean> {
    return false;
  }
  async contar(): Promise<number> {
    return 1;
  }
}

class RepositorioEncuestaMemoria implements RepositorioEncuestaPuerto {
  async guardar(encuesta: EncuestaEmocionalEntidad): Promise<EncuestaEmocionalEntidad> {
    return new EncuestaEmocionalEntidad(
      'encuesta-1',
      encuesta.estudianteId,
      encuesta.textoEmocional,
      encuesta.nivelAnimo,
      encuesta.nivelSeguridad,
      encuesta.fechaCreacion,
      encuesta.puntajeRiesgo,
      encuesta.grado,
      encuesta.zonaJunin,
      encuesta.recreoSolo,
      encuesta.animoManana,
      encuesta.miedoParticipar,
      encuesta.redesSociales,
      encuesta.apoyoFamiliar,
      encuesta.rendimiento,
      encuesta.habilidadesSociales,
      encuesta.entornoViolento,
      encuesta.evaluacionIaDisponible,
      encuesta.nivelRiesgoIa,
      encuesta.prioridadAtencionIa,
      encuesta.analisisPsicologicoIa,
      encuesta.accionRecomendadaIa,
      encuesta.factoresDetectadosIa,
      encuesta.factoresProtectoresIa,
      encuesta.prediccionArbol,
      encuesta.sentimientoTextoIa,
      encuesta.confianzaTextoIa,
      encuesta.confianzaGlobalIa,
    );
  }
  async listar(): Promise<EncuestaEmocionalEntidad[]> {
    return [];
  }
  async contar(): Promise<number> {
    return 0;
  }
  async contarConEvaluacionIa(): Promise<number> {
    return 0;
  }
  async promedioRiesgo(): Promise<number> {
    return 0;
  }
}

class RepositorioAlertaMemoria implements RepositorioAlertaPuerto {
  public alertaGuardada: AlertaEntidad | null = null;

  async guardar(alerta: AlertaEntidad): Promise<AlertaEntidad> {
    this.alertaGuardada = alerta;
    return new AlertaEntidad(
      'alerta-1',
      alerta.encuestaId,
      alerta.estudianteId,
      alerta.psicologoAsignadoId,
      alerta.puntajeRiesgo,
      alerta.estado,
      alerta.mensajeEtico,
      alerta.fechaCreacion,
      alerta.ultimaActualizacion,
    );
  }
  async listar(): Promise<AlertaEntidad[]> {
    return [];
  }
  async listarEscaladasParaAdministracion(): Promise<AlertaEntidad[]> {
    return [];
  }
  async obtenerPorId(): Promise<AlertaEntidad | null> {
    return null;
  }
  async obtenerHistoriaPorId() {
    return null;
  }
  async contar(): Promise<number> {
    return 0;
  }
  async contarPorEstado(): Promise<number> {
    return 0;
  }
  async contarPorRiesgoMinimo(): Promise<number> {
    return 0;
  }
  async contarEscaladasParaAdministracion(): Promise<number> {
    return 0;
  }
}

class EvaluadorRiesgoIaNoDisponible implements EvaluadorRiesgoIaPuerto {
  async evaluar(
    _solicitud: SolicitudEvaluacionRiesgoIa,
  ): Promise<ResultadoEvaluacionRiesgoIa> {
    return {
      disponible: false,
      puntajeRiesgo: null,
      nivelRiesgo: null,
      prioridadAtencion: null,
      analisisPsicologico: null,
      accionRecomendada: null,
      factoresDetectados: [],
      factoresProtectores: [],
      prediccionArbol: null,
      sentimientoTexto: null,
      confianzaTexto: null,
      confianzaGlobal: null,
      error: 'servicio no iniciado en prueba',
    };
  }
}

describe('RegistrarEncuestaServicio', () => {
  it('crea un registro visible para psicologia aunque el riesgo sea bajo', async () => {
    const repositorioAlerta = new RepositorioAlertaMemoria();
    const servicio = new RegistrarEncuestaServicio(
      new RepositorioEncuestaMemoria(),
      new RepositorioEstudianteMemoria(),
      repositorioAlerta,
      new CalculadorRiesgoServicio(),
      new EvaluadorRiesgoIaNoDisponible(),
    );

    await servicio.registrar({
      textoEmocional: 'Hoy me siento tranquilo y acompanado en clases',
      nivelAnimo: 5,
      nivelSeguridad: 5,
    });

    expect(repositorioAlerta.alertaGuardada).not.toBeNull();
    expect(repositorioAlerta.alertaGuardada?.estado).toBe('pendiente');
    expect(repositorioAlerta.alertaGuardada?.puntajeRiesgo).toBe(0);
  });

  it('generar alerta cuando el riesgo es mayor o igual a 40', async () => {
    const repositorioAlerta = new RepositorioAlertaMemoria();
    const servicio = new RegistrarEncuestaServicio(
      new RepositorioEncuestaMemoria(),
      new RepositorioEstudianteMemoria(),
      repositorioAlerta,
      new CalculadorRiesgoServicio(),
      new EvaluadorRiesgoIaNoDisponible(),
    );

    await servicio.registrar({
      textoEmocional: 'Siento miedo y tristeza por insultos',
      nivelAnimo: 2,
      nivelSeguridad: 2,
    });

    expect(repositorioAlerta.alertaGuardada).not.toBeNull();
    expect(repositorioAlerta.alertaGuardada?.estado).toBe('pendiente');
    expect(repositorioAlerta.alertaGuardada?.puntajeRiesgo).toBeGreaterThanOrEqual(
      40,
    );
  });
});
