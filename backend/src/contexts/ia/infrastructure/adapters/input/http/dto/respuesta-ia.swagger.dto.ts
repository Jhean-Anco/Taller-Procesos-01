import { ApiProperty } from '@nestjs/swagger';

export class RespuestaIaSwaggerDto {
  @ApiProperty({
    example:
      '1. Observa cambios grupales. 2. Registra patrones. 3. Escala a psicologia.',
  })
  contenido!: string;

  @ApiProperty({ example: 'gpt-4.1-mini' })
  modelo!: string;
}
