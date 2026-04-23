import { ApiProperty } from '@nestjs/swagger';

export class RecomendacionesIaSwaggerDto {
  @ApiProperty({
    example:
      '1. Reforzar vigilancia en recreos. 2. Aplicar sesiones grupales. 3. Compartir material preventivo con docentes.',
  })
  recomendaciones!: string;
}
