import { AlertaEntidad } from '../../dominio/entidades/alerta.entidad';
import { EncuestaEmocionalEntidad } from '../../dominio/entidades/encuesta-emocional.entidad';
import { EstudianteEntidad } from '../../dominio/entidades/estudiante.entidad';
import { CalculadorRiesgoServicio } from '../../dominio/servicios/calculador-riesgo.servicio';
import { RegistrarEncuestaServicio } from './registrar-encuesta.servicio';
import { RepositorioAlertaPuerto } from '../puertos/salida/repositorio-alerta.puerto';
import { RepositorioEncuestaPuerto } from '../puertos/salida/repositorio-encuesta.puerto';
import { RepositorioEstudiantePuerto } from '../puertos/salida/repositorio-estudiante.puerto';

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
    );
  }
  async listar(): Promise<EncuestaEmocionalEntidad[]> {
    return [];
  }
  async contar(): Promise<number> {
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
}

describe('RegistrarEncuestaServicio', () => {
  it('generar alerta cuando el riesgo es mayor o igual a 40', async () => {
    const repositorioAlerta = new RepositorioAlertaMemoria();
    const servicio = new RegistrarEncuestaServicio(
      new RepositorioEncuestaMemoria(),
      new RepositorioEstudianteMemoria(),
      repositorioAlerta,
      new CalculadorRiesgoServicio(),
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
