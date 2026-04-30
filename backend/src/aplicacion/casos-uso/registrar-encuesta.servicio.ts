import {
  Injectable,
} from '@nestjs/common';
import { AlertaEntidad } from '../../dominio/entidades/alerta.entidad';
import { EncuestaEmocionalEntidad } from '../../dominio/entidades/encuesta-emocional.entidad';
import { CalculadorRiesgoServicio } from '../../dominio/servicios/calculador-riesgo.servicio';
import { EstudianteEntidad } from '../../dominio/entidades/estudiante.entidad';
import { RegistrarEncuestaDto } from '../dto/registrar-encuesta.dto';
import { RegistrarEncuestaCasoUso } from '../puertos/entrada/registrar-encuesta.caso-uso';
import { RepositorioAlertaPuerto } from '../puertos/salida/repositorio-alerta.puerto';
import { RepositorioEncuestaPuerto } from '../puertos/salida/repositorio-encuesta.puerto';
import { RepositorioEstudiantePuerto } from '../puertos/salida/repositorio-estudiante.puerto';

@Injectable()
export class RegistrarEncuestaServicio implements RegistrarEncuestaCasoUso {
  constructor(
    private readonly repositorioEncuesta: RepositorioEncuestaPuerto,
    private readonly repositorioEstudiante: RepositorioEstudiantePuerto,
    private readonly repositorioAlerta: RepositorioAlertaPuerto,
    private readonly calculadorRiesgo: CalculadorRiesgoServicio,
  ) {}

  async registrar(dto: RegistrarEncuestaDto): Promise<EncuestaEmocionalEntidad> {
    const estudiante = await this.repositorioEstudiante.guardar(
      new EstudianteEntidad(
        null,
        null,
        this.generarCodigoAnonimo(),
        new Date(),
      ),
    );

    const encuesta = await this.repositorioEncuesta.guardar(
      new EncuestaEmocionalEntidad(
        null,
        estudiante.id as string,
        dto.textoEmocional.trim(),
        dto.nivelAnimo,
        dto.nivelSeguridad,
        new Date(),
      ),
    );

    const riesgo = this.calculadorRiesgo.calcular(encuesta);

    if (riesgo.puntaje.valor() >= 40) {
      await this.repositorioAlerta.guardar(
        new AlertaEntidad(
          null,
          encuesta.id as string,
          encuesta.estudianteId,
          null,
          riesgo.puntaje.valor(),
          'pendiente',
          'Este sistema no emite diagnosticos. La alerta solo orienta una revision humana.',
          new Date(),
          new Date(),
        ),
      );
    }

    return encuesta;
  }

  listar(): Promise<EncuestaEmocionalEntidad[]> {
    return this.repositorioEncuesta.listar();
  }

  private generarCodigoAnonimo(): string {
    const sello = Date.now().toString(36).toUpperCase();
    const aleatorio = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `REP-${sello}-${aleatorio}`;
  }
}
