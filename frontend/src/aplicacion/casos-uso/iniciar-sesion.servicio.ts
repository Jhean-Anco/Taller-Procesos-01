import { IniciarSesionDto } from '../dto/iniciar-sesion.dto';
import { ClienteApiPuerto } from '../puertos/salida/cliente-api.puerto';

export class IniciarSesionServicio {
  constructor(private readonly clienteApi: ClienteApiPuerto) {}

  ejecutar(dto: IniciarSesionDto) {
    return this.clienteApi.iniciarSesion(dto);
  }
}
