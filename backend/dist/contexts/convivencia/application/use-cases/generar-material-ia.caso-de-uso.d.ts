import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import { GenerarTextoCasoDeUso } from '../../../ia/application/use-cases/generar-texto.caso-de-uso';
export interface ComandoGenerarMaterialIa {
    tema: string;
    nivelEscolar: string;
    objetivo: string;
    rolSolicitante: string;
}
export declare class GenerarMaterialIaCasoDeUso implements CasoDeUso<Promise<{
    materialSugerido: string;
}>, [
    ComandoGenerarMaterialIa
]> {
    private readonly generarTextoCasoDeUso;
    constructor(generarTextoCasoDeUso: GenerarTextoCasoDeUso);
    ejecutar(command: ComandoGenerarMaterialIa): Promise<{
        materialSugerido: string;
    }>;
}
