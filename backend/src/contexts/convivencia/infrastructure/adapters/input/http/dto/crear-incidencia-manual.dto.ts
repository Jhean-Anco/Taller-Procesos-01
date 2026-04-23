import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { NivelEscolar } from '../../../../../domain/enums/nivel-escolar.enum';
import { TipoIncidencia } from '../../../../../domain/enums/tipo-incidencia.enum';

export class CrearIncidenciaManualDto {
  @ApiProperty({
    description:
      'La IA toma este contexto para clasificar la severidad antes de persistir la incidencia.',
    enum: NivelEscolar,
    example: NivelEscolar.SECUNDARIA,
  })
  @IsEnum(NivelEscolar)
  nivelEscolar!: NivelEscolar;

  @ApiProperty({ example: '2do' })
  @IsString()
  grado!: string;

  @ApiProperty({ example: 'C' })
  @IsString()
  seccion!: string;

  @ApiProperty({
    description:
      'Sirve como señal inicial del caso, pero el nivel de alerta ya no lo define el frontend.',
    enum: TipoIncidencia,
    example: TipoIncidencia.BULLYING_VERBAL,
  })
  @IsEnum(TipoIncidencia)
  tipoIncidencia!: TipoIncidencia;

  @ApiProperty({
    example:
      'Se detecto un patron grupal de agresion verbal durante actividades de aula.',
    minLength: 10,
    maxLength: 1000,
    description:
      'La IA analiza esta descripcion para devolver la criticidad operativa del caso.',
  })
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  descripcion!: string;
}
