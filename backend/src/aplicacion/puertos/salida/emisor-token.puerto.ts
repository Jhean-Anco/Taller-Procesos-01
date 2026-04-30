import { UsuarioAutenticadoDto } from '../../dto/usuario-autenticado.dto';

export abstract class EmisorTokenPuerto {
  abstract emitirTokenAcceso(payload: UsuarioAutenticadoDto): Promise<string>;
}
