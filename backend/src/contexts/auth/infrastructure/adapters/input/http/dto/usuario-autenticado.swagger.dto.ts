import { ApiProperty } from '@nestjs/swagger';
import { Rol } from '../../../../../../../shared/domain/enums/rol.enum';

export class UsuarioAutenticadoSwaggerDto {
  @ApiProperty({ example: 'usr_12345678' })
  id!: string;

  @ApiProperty({ example: 'Psicologia Escolar' })
  nombre!: string;

  @ApiProperty({ example: 'psicologia@colegio.edu' })
  correo!: string;

  @ApiProperty({ enum: Rol, example: Rol.PSICOLOGO })
  rol!: Rol;
}
