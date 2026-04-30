import { EncuestaEmocionalEntidad } from '../entidades/encuesta-emocional.entidad';
import { CalculadorRiesgoServicio } from './calculador-riesgo.servicio';

describe('CalculadorRiesgoServicio', () => {
  const servicio = new CalculadorRiesgoServicio();

  it('calcular riesgo bajo', () => {
    const encuesta = new EncuestaEmocionalEntidad(
      null,
      'est-1',
      'Hoy me siento tranquilo y acompanado',
      5,
      5,
      new Date(),
    );

    const riesgo = servicio.calcular(encuesta);

    expect(riesgo.puntaje.valor()).toBe(0);
    expect(riesgo.nivel.valor()).toBe('bajo');
  });

  it('calcular riesgo medio', () => {
    const encuesta = new EncuestaEmocionalEntidad(
      null,
      'est-1',
      'Me siento triste a veces',
      3,
      3,
      new Date(),
    );

    const riesgo = servicio.calcular(encuesta);

    expect(riesgo.puntaje.valor()).toBe(40);
    expect(riesgo.nivel.valor()).toBe('medio');
  });

  it('calcular riesgo alto', () => {
    const encuesta = new EncuestaEmocionalEntidad(
      null,
      'est-1',
      'Tengo miedo, recibo insultos y amenazas, me siento solo',
      1,
      1,
      new Date(),
    );

    const riesgo = servicio.calcular(encuesta);

    expect(riesgo.puntaje.valor()).toBe(100);
    expect(riesgo.nivel.valor()).toBe('alto');
  });
});
