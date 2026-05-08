import { ApiProperty } from '@nestjs/swagger';
import { UsuarioAutenticadoSwaggerDto } from './usuario-autenticado.swagger.dto';

export class RespuestaLoginSwaggerDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.firma-ejemplo',
  })
  accessToken!: string;

  @ApiProperty({ type: UsuarioAutenticadoSwaggerDto })
  usuario!: UsuarioAutenticadoSwaggerDto;
}
