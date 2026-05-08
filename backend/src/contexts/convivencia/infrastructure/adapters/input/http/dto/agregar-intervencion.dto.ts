import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { ResultadoIntervencion } from '../../../../../domain/enums/resultado-intervencion.enum';

export class AgregarIntervencionDto {
  @ApiProperty({
    example: 'Sesion grupal de mediacion y observacion de aula.',
    minLength: 8,
    maxLength: 500,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(500)
  estrategia!: string;

  @ApiProperty({
    enum: ResultadoIntervencion,
    example: ResultadoIntervencion.PARCIAL,
  })
  @IsEnum(ResultadoIntervencion)
  resultado!: ResultadoIntervencion;

  @ApiProperty({
    example: 'El grupo mostro menor nivel de hostilidad tras la intervencion.',
    minLength: 4,
    maxLength: 500,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(500)
  observaciones!: string;
}
