import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import { GenerarTextoCasoDeUso } from '../../../ia/application/use-cases/generar-texto.caso-de-uso';
import { ObtenerEstadisticasClimaEscolarCasoDeUso } from './obtener-estadisticas-clima-escolar.caso-de-uso';
export declare class GenerarRecomendacionesIaCasoDeUso implements CasoDeUso<Promise<{
    recomendaciones: string;
}>, [
    string
]> {
    private readonly generarTextoCasoDeUso;
    private readonly obtenerEstadisticasClimaEscolarCasoDeUso;
    constructor(generarTextoCasoDeUso: GenerarTextoCasoDeUso, obtenerEstadisticasClimaEscolarCasoDeUso: ObtenerEstadisticasClimaEscolarCasoDeUso);
    ejecutar(rolSolicitante: string): Promise<{
        recomendaciones: string;
    }>;
}
