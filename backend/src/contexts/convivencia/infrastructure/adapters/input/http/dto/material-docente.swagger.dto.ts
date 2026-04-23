import { ApiProperty } from '@nestjs/swagger';

export class MaterialDocenteSwaggerDto {
  @ApiProperty({ example: 'mat_12345678' })
  id!: string;

  @ApiProperty({ example: 'Guia breve para detectar bullying' })
  titulo!: string;

  @ApiProperty({
    example: 'Material para docentes de secundaria sobre señales tempranas.',
  })
  descripcion!: string;

  @ApiProperty({
    example: '1. Observa cambios grupales. 2. Registra patrones. 3. Escala.',
  })
  contenido!: string;

  @ApiProperty({ example: 'usr_12345678' })
  creadoPor!: string;

  @ApiProperty({ example: ['bullying', 'prevencion', 'convivencia'] })
  temas!: string[];

  @ApiProperty({
    enum: ['docentes', 'equipo_psicologia', 'mixto'],
    example: 'docentes',
  })
  publicoObjetivo!: 'docentes' | 'equipo_psicologia' | 'mixto';

  @ApiProperty({ example: '2026-04-23T12:00:00.000Z' })
  fecha!: string;
}
