import { FiltroAlertasDto } from '../dto/filtro-alertas.dto';
import { RegistrarSeguimientoAlertaDto } from '../dto/registrar-seguimiento-alerta.dto';
import { ActualizarAlertaDto } from '../dto/actualizar-alerta.dto';
import { ClienteApiPuerto } from '../puertos/salida/cliente-api.puerto';

export class GestionarAlertasServicio {
  constructor(private readonly clienteApi: ClienteApiPuerto) {}

  listar(filtros?: FiltroAlertasDto) {
    return this.clienteApi.listarAlertas(filtros);
  }

  actualizar(id: string, dto: ActualizarAlertaDto) {
    return this.clienteApi.actualizarAlerta(id, dto);
  }

  obtenerHistoria(id: string) {
    return this.clienteApi.obtenerHistoriaAlerta(id);
  }

  registrarSeguimiento(id: string, dto: RegistrarSeguimientoAlertaDto) {
    return this.clienteApi.registrarSeguimientoAlerta(id, dto);
  }
}
