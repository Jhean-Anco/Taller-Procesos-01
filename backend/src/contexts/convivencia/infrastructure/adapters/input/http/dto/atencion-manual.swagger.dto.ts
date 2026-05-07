import { ApiProperty } from '@nestjs/swagger';
import { NivelAlerta } from '../../../../../domain/enums/nivel-alerta.enum';
import { NivelEscolar } from '../../../../../domain/enums/nivel-escolar.enum';
import { TipoIncidencia } from '../../../../../domain/enums/tipo-incidencia.enum';

export class AtencionManualSwaggerDto {
  @ApiProperty({ example: 'atm_12345678' })
  id!: string;

  @ApiProperty({ example: '2026-04-23T12:00:00.000Z' })
  fecha!: string;

  @ApiProperty({ enum: NivelEscolar, example: NivelEscolar.PRIMARIA })
  nivelEscolar!: NivelEscolar;

  @ApiProperty({ example: '5to' })
  grado!: string;

  @ApiProperty({ example: 'A' })
  seccion!: string;

  @ApiProperty({
    enum: TipoIncidencia,
    example: TipoIncidencia.EXCLUSION_SOCIAL,
  })
  tipoIncidencia!: TipoIncidencia;

  @ApiProperty({
    example: 'Situacion grupal observada por el equipo de psicologia.',
  })
  descripcion!: string;

  @ApiProperty({
    example: 'Se acuerdo seguimiento con tutoria y observacion posterior.',
  })
  observaciones!: string;

  @ApiProperty({ example: 'usr_12345678' })
  atendidoPor!: string;

  @ApiProperty({ enum: NivelAlerta, example: NivelAlerta.MEDIA })
  nivelAlerta!: NivelAlerta;

  @ApiProperty({ example: false })
  alertaCritica!: boolean;
}
