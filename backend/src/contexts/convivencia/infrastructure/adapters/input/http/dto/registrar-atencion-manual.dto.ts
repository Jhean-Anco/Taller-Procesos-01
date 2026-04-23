import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { NivelEscolar } from '../../../../../domain/enums/nivel-escolar.enum';
import { TipoIncidencia } from '../../../../../domain/enums/tipo-incidencia.enum';

export class RegistrarAtencionManualDto {
  @ApiProperty({
    description:
      'Se utiliza como contexto para la clasificacion previa de IA del registro manual.',
    enum: NivelEscolar,
    example: NivelEscolar.PRIMARIA,
  })
  @IsEnum(NivelEscolar)
  nivelEscolar!: NivelEscolar;

  @ApiProperty({ example: '5to' })
  @IsString()
  grado!: string;

  @ApiProperty({ example: 'A' })
  @IsString()
  seccion!: string;

  @ApiProperty({
    description:
      'Indica la naturaleza del caso, pero la prioridad final la calcula la IA.',
    enum: TipoIncidencia,
    example: TipoIncidencia.EXCLUSION_SOCIAL,
  })
  @IsEnum(TipoIncidencia)
  tipoIncidencia!: TipoIncidencia;

  @ApiProperty({
    example:
      'Se presenta una situacion grupal observada por el equipo de psicologia.',
    minLength: 10,
    maxLength: 1000,
    description:
      'Descripcion base del caso usada por la IA para inferir la criticidad antes del guardado.',
  })
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  descripcion!: string;

  @ApiProperty({
    example:
      'Se acordo seguimiento grupal con tutoria y observacion posterior.',
    minLength: 4,
    maxLength: 1000,
    description:
      'Contexto adicional que tambien puede influir en la evaluacion de criticidad.',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(1000)
  observaciones!: string;
}
