import { RegistrarEstudianteDto } from '../dto/registrar-estudiante.dto';
import { ClienteApiPuerto } from '../puertos/salida/cliente-api.puerto';

export class GestionarEstudiantesServicio {
  constructor(private readonly clienteApi: ClienteApiPuerto) {}

  registrar(dto: RegistrarEstudianteDto) {
    return this.clienteApi.registrarEstudiante(dto);
  }

  listar() {
    return this.clienteApi.listarEstudiantes();
  }
}
