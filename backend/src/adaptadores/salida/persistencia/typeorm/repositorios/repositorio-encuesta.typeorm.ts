import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepositorioEncuestaPuerto } from '../../../../../aplicacion/puertos/salida/repositorio-encuesta.puerto';
import { EncuestaEmocionalEntidad } from '../../../../../dominio/entidades/encuesta-emocional.entidad';
import { CalculadorRiesgoServicio } from '../../../../../dominio/servicios/calculador-riesgo.servicio';
import { EncuestaEmocionalOrmEntidad } from '../entidades/encuesta-emocional.orm-entidad';
import { EncuestaEmocionalMapeador } from '../mapeadores/encuesta-emocional.mapeador';

@Injectable()
export class RepositorioEncuestaTypeorm implements RepositorioEncuestaPuerto {
  constructor(
    @InjectRepository(EncuestaEmocionalOrmEntidad)
    private readonly repositorio: Repository<EncuestaEmocionalOrmEntidad>,
    private readonly calculadorRiesgo: CalculadorRiesgoServicio,
  ) {}

  async guardar(encuesta: EncuestaEmocionalEntidad): Promise<EncuestaEmocionalEntidad> {
    const puntajeRiesgo = this.calculadorRiesgo.calcular(encuesta).puntaje.valor();
    const guardado = await this.repositorio.save(
      this.repositorio.create(
        EncuestaEmocionalMapeador.aPersistencia(encuesta, puntajeRiesgo),
      ),
    );
    return EncuestaEmocionalMapeador.aDominio(guardado);
  }

  async listar(): Promise<EncuestaEmocionalEntidad[]> {
    const encuestas = await this.repositorio.find({
      order: { fechaCreacion: 'DESC' },
    });
    return encuestas.map(EncuestaEmocionalMapeador.aDominio);
  }

  contar(): Promise<number> {
    return this.repositorio.count();
  }

  contarConEvaluacionIa(): Promise<number> {
    return this.repositorio.countBy({ evaluacionIaDisponible: true });
  }

  async promedioRiesgo(): Promise<number> {
    const resultado = await this.repositorio
      .createQueryBuilder('encuesta')
      .select('AVG(encuesta.puntajeRiesgo)', 'promedio')
      .getRawOne<{ promedio: string | null }>();

    return resultado?.promedio ? Number(resultado.promedio) : 0;
  }
}
