import { IniciarSesionDto } from '../../dto/iniciar-sesion.dto';
import { RespuestaSesionDto } from '../../dto/respuesta-sesion.dto';

export abstract class IniciarSesionCasoUso {
  abstract ejecutar(dto: IniciarSesionDto): Promise<RespuestaSesionDto>;
}
