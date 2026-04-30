import { ClienteApiPuerto } from '../puertos/salida/cliente-api.puerto';

export class ObtenerPanelServicio {
  constructor(private readonly clienteApi: ClienteApiPuerto) {}

  ejecutar() {
    return this.clienteApi.obtenerPanel();
  }
}
