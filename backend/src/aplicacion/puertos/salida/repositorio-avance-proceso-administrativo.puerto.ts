import { AvanceProcesoAdministrativoEntidad } from '../../../dominio/entidades/avance-proceso-administrativo.entidad';

export abstract class RepositorioAvanceProcesoAdministrativoPuerto {
  abstract guardar(
    avance: AvanceProcesoAdministrativoEntidad,
  ): Promise<AvanceProcesoAdministrativoEntidad>;
  abstract listarPorProceso(
    procesoAdministrativoId: string,
  ): Promise<AvanceProcesoAdministrativoEntidad[]>;
  abstract contar(): Promise<number>;
}
