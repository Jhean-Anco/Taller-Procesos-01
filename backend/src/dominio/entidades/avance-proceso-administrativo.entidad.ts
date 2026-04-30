import { EstadoProcesoAdministrativo } from './proceso-administrativo.entidad';

export type TipoAvanceProcesoAdministrativo = 'avance' | 'resultado';

export class AvanceProcesoAdministrativoEntidad {
  constructor(
    public readonly id: string | null,
    public readonly procesoAdministrativoId: string,
    public readonly administrativoId: string,
    public readonly descripcionAvance: string,
    public readonly tipo: TipoAvanceProcesoAdministrativo,
    public readonly estado: EstadoProcesoAdministrativo,
    public readonly fechaCreacion: Date,
  ) {}
}
