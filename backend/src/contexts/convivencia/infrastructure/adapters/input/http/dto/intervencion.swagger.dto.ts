import { ApiProperty } from '@nestjs/swagger';
import { ResultadoIntervencion } from '../../../../../domain/enums/resultado-intervencion.enum';

export class IntervencionSwaggerDto {
  @ApiProperty({ example: 'int_12345678' })
  id!: string;

  @ApiProperty({ example: '2026-04-23T12:00:00.000Z' })
  fecha!: string;

  @ApiProperty({
    example: 'Sesion grupal de mediacion y observacion de aula.',
  })
  estrategia!: string;

  @ApiProperty({ example: 'usr_12345678' })
  responsableId!: string;

  @ApiProperty({ example: 'psicologo' })
  responsableRol!: string;

  @ApiProperty({
    enum: ResultadoIntervencion,
    example: ResultadoIntervencion.PARCIAL,
  })
  resultado!: ResultadoIntervencion;

  @ApiProperty({
    example: 'Se observaron mejoras parciales y se mantiene seguimiento.',
  })
  observaciones!: string;
}
