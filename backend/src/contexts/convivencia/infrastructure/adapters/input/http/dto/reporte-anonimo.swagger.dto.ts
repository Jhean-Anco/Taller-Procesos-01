import { ApiProperty } from '@nestjs/swagger';
import { NivelAlerta } from '../../../../../domain/enums/nivel-alerta.enum';
import { NivelEscolar } from '../../../../../domain/enums/nivel-escolar.enum';
import { TipoIncidencia } from '../../../../../domain/enums/tipo-incidencia.enum';

export class ReporteAnonimoSwaggerDto {
  @ApiProperty({ example: 'rep_12345678' })
  id!: string;

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
    example: TipoIncidencia.HOSTIGAMIENTO_REITERADO,
  })
  tipoIncidencia!: TipoIncidencia;

  @ApiProperty({
    example: 'Se reportan burlas repetidas durante el recreo hacia un grupo.',
  })
  descripcion!: string;

  @ApiProperty({ enum: NivelAlerta, example: NivelAlerta.MEDIA })
  nivelAlerta!: NivelAlerta;

  @ApiProperty({ example: false })
  alertaCritica!: boolean;

  @ApiProperty({ enum: ['nuevo', 'escalado'], example: 'nuevo' })
  estado!: 'nuevo' | 'escalado';
}
