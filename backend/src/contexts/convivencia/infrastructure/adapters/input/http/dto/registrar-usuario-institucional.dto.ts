import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Rol } from '../../../../../../../shared/domain/enums/rol.enum';

export class RegistrarUsuarioInstitucionalDto {
  @ApiProperty({ example: 'Ana Perez' })
  @IsString()
  @MinLength(3)
  nombre!: string;

  @ApiProperty({ example: 'ana.perez@colegio.edu' })
  @IsEmail()
  correo!: string;

  @ApiProperty({ enum: Rol, example: Rol.PSICOLOGO })
  @IsEnum(Rol)
  rol!: Rol;

  @ApiProperty({ example: 'Psicologia' })
  @IsString()
  @MinLength(2)
  area!: string;

  @ApiProperty({ example: 'ClaveSegura123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;
}
