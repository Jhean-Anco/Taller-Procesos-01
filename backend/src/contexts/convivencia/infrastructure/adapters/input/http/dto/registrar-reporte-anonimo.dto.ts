import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { NivelEscolar } from '../../../../../domain/enums/nivel-escolar.enum';
import { TipoIncidencia } from '../../../../../domain/enums/tipo-incidencia.enum';

export class RegistrarReporteAnonimoDto {
  @ApiProperty({
    description:
      'La IA usa este contexto para clasificar la criticidad real del reporte.',
    enum: NivelEscolar,
    example: NivelEscolar.SECUNDARIA,
  })
  @IsEnum(NivelEscolar)
  nivelEscolar!: NivelEscolar;

  @ApiProperty({ example: '3ro' })
  @IsString()
  grado!: string;

  @ApiProperty({ example: 'B' })
  @IsString()
  seccion!: string;

  @ApiProperty({
    description:
      'Se conserva como señal temática del caso, pero la criticidad final la determina la IA.',
    enum: TipoIncidencia,
    example: TipoIncidencia.HOSTIGAMIENTO_REITERADO,
  })
  @IsEnum(TipoIncidencia)
  tipoIncidencia!: TipoIncidencia;

  @ApiProperty({
    example:
      'Se reportan burlas repetidas durante el recreo hacia un grupo de estudiantes.',
    minLength: 10,
    maxLength: 800,
    description:
      'Descripcion libre enviada a la IA para clasificar el nivel de alerta antes de guardar.',
  })
  @IsString()
  @MinLength(10)
  @MaxLength(800)
  descripcion!: string;
}
