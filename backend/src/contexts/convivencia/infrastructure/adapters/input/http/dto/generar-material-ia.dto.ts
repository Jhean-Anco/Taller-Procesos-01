import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class GenerarMaterialIaDto {
  @ApiProperty({ example: 'Bullying relacional' })
  @IsString()
  @MinLength(4)
  tema!: string;

  @ApiProperty({ example: 'Secundaria' })
  @IsString()
  @MinLength(4)
  nivelEscolar!: string;

  @ApiProperty({
    example:
      'Entregar una guia breve para que docentes detecten indicios tempranos.',
    minLength: 8,
    maxLength: 500,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(500)
  objetivo!: string;
}
