import { ApiProperty } from '@nestjs/swagger';

export class EstadisticasClimaEscolarSwaggerDto {
  @ApiProperty({ example: 12 })
  totalReportesAnonimos!: number;

  @ApiProperty({ example: 8 })
  totalIncidencias!: number;

  @ApiProperty({ example: 2 })
  totalAlertasCriticas!: number;

  @ApiProperty({ example: 5 })
  totalAtencionesManuales!: number;

  @ApiProperty({ example: 3 })
  incidenciasPrimaria!: number;

  @ApiProperty({ example: 5 })
  incidenciasSecundaria!: number;

  @ApiProperty({ example: 71.43 })
  tasaExitoIntervenciones!: number;

  @ApiProperty({
    example: {
      bullying_verbal: 3,
      exclusion_social: 2,
      ciberbullying: 1,
    },
    additionalProperties: { type: 'number' },
  })
  incidenciasPorTipo!: Record<string, number>;

  @ApiProperty({ example: 64 })
  indiceClimaEscolar!: number;
}
