import { RegistrarEncuestaDto } from '../dto/registrar-encuesta.dto';
import { ClienteApiPuerto } from '../puertos/salida/cliente-api.puerto';

export class GestionarEncuestasServicio {
  constructor(private readonly clienteApi: ClienteApiPuerto) {}

  registrar(dto: RegistrarEncuestaDto) {
    return this.clienteApi.registrarEncuesta(dto);
  }

  listar() {
    return this.clienteApi.listarEncuestas();
  }
}
