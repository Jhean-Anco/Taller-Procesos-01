import { SeguimientoAlertaEntidad } from '../../../dominio/entidades/seguimiento-alerta.entidad';

export abstract class RepositorioSeguimientoAlertaPuerto {
  abstract guardar(
    seguimiento: SeguimientoAlertaEntidad,
  ): Promise<SeguimientoAlertaEntidad>;
  abstract listarPorAlerta(alertaId: string): Promise<SeguimientoAlertaEntidad[]>;
}
