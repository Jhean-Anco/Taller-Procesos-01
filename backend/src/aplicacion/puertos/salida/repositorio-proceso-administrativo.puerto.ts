import { ProcesoAdministrativoEntidad } from '../../../dominio/entidades/proceso-administrativo.entidad';

export abstract class RepositorioProcesoAdministrativoPuerto {
  abstract guardar(
    proceso: ProcesoAdministrativoEntidad,
  ): Promise<ProcesoAdministrativoEntidad>;
  abstract obtenerPorId(id: string): Promise<ProcesoAdministrativoEntidad | null>;
  abstract listarPorAlerta(alertaId: string): Promise<ProcesoAdministrativoEntidad[]>;
  abstract contar(): Promise<number>;
  abstract contarPorEstado(
    estado: ProcesoAdministrativoEntidad['estado'],
  ): Promise<number>;
}
