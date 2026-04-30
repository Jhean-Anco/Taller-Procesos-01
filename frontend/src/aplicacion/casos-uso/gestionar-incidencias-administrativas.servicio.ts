import { FiltroAlertasDto } from '../dto/filtro-alertas.dto';
import { RegistrarAvanceProcesoAdministrativoDto } from '../dto/registrar-avance-proceso-administrativo.dto';
import { RegistrarProcesoAdministrativoDto } from '../dto/registrar-proceso-administrativo.dto';
import { ClienteApiPuerto } from '../puertos/salida/cliente-api.puerto';

export class GestionarIncidenciasAdministrativasServicio {
  constructor(private readonly clienteApi: ClienteApiPuerto) {}

  listar(filtros?: FiltroAlertasDto) {
    return this.clienteApi.listarIncidenciasAdministrativas(filtros);
  }

  obtenerHistoria(id: string) {
    return this.clienteApi.obtenerHistoriaIncidenciaAdministrativa(id);
  }

  registrarProceso(id: string, dto: RegistrarProcesoAdministrativoDto) {
    return this.clienteApi.registrarProcesoAdministrativo(id, dto);
  }

  registrarAvance(
    procesoId: string,
    dto: RegistrarAvanceProcesoAdministrativoDto,
  ) {
    return this.clienteApi.registrarAvanceProcesoAdministrativo(procesoId, dto);
  }
}
