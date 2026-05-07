import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class GenerarTextoDto {
  @ApiProperty({
    example:
      'Genera una guia breve para docentes sobre deteccion temprana de bullying.',
    minLength: 10,
    maxLength: 1000,
  })
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  prompt!: string;
}
