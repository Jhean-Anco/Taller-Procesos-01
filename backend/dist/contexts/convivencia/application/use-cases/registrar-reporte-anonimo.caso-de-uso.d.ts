import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import { CrearReporteAnonimo } from '../ports/output/convivencia.repository';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { ReporteAnonimo } from '../../domain/entities/reporte-anonimo.entidad';
export declare class RegistrarReporteAnonimoCasoDeUso implements CasoDeUso<Promise<ReporteAnonimo>, [
    CrearReporteAnonimo
]> {
    private readonly repositorioConvivencia;
    constructor(repositorioConvivencia: RepositorioConvivencia);
    ejecutar(data: CrearReporteAnonimo): Promise<ReporteAnonimo>;
}
