import { ApiProperty } from '@nestjs/swagger';
import { Rol } from '../../../../../../../shared/domain/enums/rol.enum';

export class UsuarioInstitucionalSwaggerDto {
  @ApiProperty({ example: 'usr_12345678' })
  id!: string;

  @ApiProperty({ example: 'Ana Perez' })
  nombre!: string;

  @ApiProperty({ example: 'ana.perez@colegio.edu' })
  correo!: string;

  @ApiProperty({ enum: Rol, example: Rol.PSICOLOGO })
  rol!: Rol;

  @ApiProperty({ example: 'Psicologia' })
  area!: string;

  @ApiProperty({ example: true })
  activo!: boolean;
}
