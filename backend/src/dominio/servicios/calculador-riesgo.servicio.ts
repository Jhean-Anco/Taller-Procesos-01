import { EncuestaEmocionalEntidad } from '../entidades/encuesta-emocional.entidad';
import { RiesgoBullyingEntidad } from '../entidades/riesgo-bullying.entidad';
import { NivelRiesgoVo } from '../objetos-valor/nivel-riesgo.vo';
import { PuntajeRiesgoVo } from '../objetos-valor/puntaje-riesgo.vo';

export class CalculadorRiesgoServicio {
  private readonly palabrasCriticas = [
    'miedo',
    'triste',
    'solo',
    'insultos',
    'golpes',
    'amenaza',
  ];

  calcular(encuesta: EncuestaEmocionalEntidad): RiesgoBullyingEntidad {
    let puntaje = 0;
    const motivos: string[] = [];

    if (encuesta.nivelAnimo <= 2) {
      puntaje += 25;
      motivos.push('nivel de animo bajo');
    } else if (encuesta.nivelAnimo === 3) {
      puntaje += 10;
      motivos.push('nivel de animo moderado');
    }

    if (encuesta.nivelSeguridad <= 2) {
      puntaje += 30;
      motivos.push('nivel de seguridad bajo');
    } else if (encuesta.nivelSeguridad === 3) {
      puntaje += 15;
      motivos.push('nivel de seguridad moderado');
    }

    const textoNormalizado = encuesta.textoEmocional.toLowerCase();
    const palabrasDetectadas = this.palabrasCriticas.filter((palabra) =>
      textoNormalizado.includes(palabra),
    );

    if (palabrasDetectadas.length > 0) {
      puntaje += Math.min(45, palabrasDetectadas.length * 15);
      motivos.push(`palabras de riesgo: ${palabrasDetectadas.join(', ')}`);
    }

    const puntajeVo = PuntajeRiesgoVo.crear(puntaje);
    return new RiesgoBullyingEntidad(
      puntajeVo,
      NivelRiesgoVo.desdePuntaje(puntajeVo.valor()),
      motivos,
    );
  }
}
