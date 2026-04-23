import { ApiProperty } from '@nestjs/swagger';

export class MetaRespuestaApiDto {
  @ApiProperty({
    example: '2026-04-23T12:00:00.000Z',
    description: 'Fecha y hora de la respuesta en formato ISO 8601.',
  })
  timestamp!: string;

  @ApiProperty({
    example: '/api/v1/salud',
    description: 'Ruta HTTP atendida por el backend.',
  })
  path!: string;
}

export class RespuestaApiBaseDto {
  @ApiProperty({ example: true })
  ok!: true;

  @ApiProperty({ type: MetaRespuestaApiDto })
  meta!: MetaRespuestaApiDto;
}
