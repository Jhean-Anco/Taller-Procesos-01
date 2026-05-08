import { ApiProperty } from '@nestjs/swagger';
import { UsuarioAutenticadoSwaggerDto } from './usuario-autenticado.swagger.dto';

export class RespuestaSesionSwaggerDto {
  @ApiProperty({ type: UsuarioAutenticadoSwaggerDto })
  usuario!: UsuarioAutenticadoSwaggerDto;
}
