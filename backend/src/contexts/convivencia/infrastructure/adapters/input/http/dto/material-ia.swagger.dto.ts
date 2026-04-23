import { ApiProperty } from '@nestjs/swagger';

export class MaterialIaSwaggerDto {
  @ApiProperty({
    example:
      'Guia para docentes: identificar patrones de exclusión y registrar observaciones grupales.',
  })
  materialSugerido!: string;
}
