import { ApiProperty } from '@nestjs/swagger';
import { EstadoIncidencia } from '../../../../../domain/enums/estado-incidencia.enum';
import { NivelAlerta } from '../../../../../domain/enums/nivel-alerta.enum';
import { NivelEscolar } from '../../../../../domain/enums/nivel-escolar.enum';
import { TipoIncidencia } from '../../../../../domain/enums/tipo-incidencia.enum';
import { IntervencionSwaggerDto } from './intervencion.swagger.dto';

export class IncidenciaPsicologicaSwaggerDto {
  @ApiProperty({ example: 'inc_12345678' })
  id!: string;

  @ApiProperty({
    enum: ['reporte_anonimo', 'registro_manual'],
    example: 'reporte_anonimo',
  })
  origen!: 'reporte_anonimo' | 'registro_manual';

  @ApiProperty({ example: '2026-04-23T12:00:00.000Z' })
  fecha!: string;

  @ApiProperty({ enum: NivelEscolar, example: NivelEscolar.SECUNDARIA })
  nivelEscolar!: NivelEscolar;

  @ApiProperty({ example: '3ro' })
  grado!: string;

  @ApiProperty({ example: 'B' })
  seccion!: string;

  @ApiProperty({
    enum: TipoIncidencia,
    example: TipoIncidencia.BULLYING_VERBAL,
  })
  tipoIncidencia!: TipoIncidencia;

  @ApiProperty({
    example: 'Patron grupal de agresion verbal observado en aula.',
  })
  descripcion!: string;

  @ApiProperty({ enum: NivelAlerta, example: NivelAlerta.ALTA })
  nivelAlerta!: NivelAlerta;

  @ApiProperty({ example: true })
  alertaCritica!: boolean;

  @ApiProperty({
    enum: EstadoIncidencia,
    example: EstadoIncidencia.EN_SEGUIMIENTO,
  })
  estado!: EstadoIncidencia;

  @ApiProperty({ example: 2 })
  totalReportesRelacionados!: number;

  @ApiProperty({ type: [IntervencionSwaggerDto] })
  intervenciones!: IntervencionSwaggerDto[];
}
