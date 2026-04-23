import { Injectable } from '@nestjs/common';
import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import { GenerarTextoCasoDeUso } from '../../../ia/application/use-cases/generar-texto.caso-de-uso';

export interface ComandoGenerarMaterialIa {
  tema: string;
  nivelEscolar: string;
  objetivo: string;
  rolSolicitante: string;
}

@Injectable()
export class GenerarMaterialIaCasoDeUso implements CasoDeUso<
  Promise<{ materialSugerido: string }>,
  [ComandoGenerarMaterialIa]
> {
  constructor(private readonly generarTextoCasoDeUso: GenerarTextoCasoDeUso) {}

  async ejecutar(
    command: ComandoGenerarMaterialIa,
  ): Promise<{ materialSugerido: string }> {
    const respuesta = await this.generarTextoCasoDeUso.ejecutar({
      prompt: `Genera material breve y accionable para docentes sobre convivencia escolar.
Tema: ${command.tema}
Nivel escolar: ${command.nivelEscolar}
Objetivo: ${command.objetivo}
Enfoque: intervencion grupal, prevencion de bullying, lenguaje institucional, sin datos sensibles ni referencias a victimas identificables.`,
      rolSolicitante: command.rolSolicitante,
    });

    return {
      materialSugerido: respuesta.contenido,
    };
  }
}
