import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CrearMaterialDocenteDto {
  @ApiProperty({ example: 'Guia breve para detectar bullying' })
  @IsString()
  @MinLength(5)
  titulo!: string;

  @ApiProperty({
    example: 'Material para docentes de secundaria sobre señales tempranas.',
  })
  @IsString()
  @MinLength(10)
  descripcion!: string;

  @ApiProperty({
    example:
      '1. Observa cambios grupales. 2. Registra patrones. 3. Escala al equipo de psicologia.',
    minLength: 20,
    maxLength: 4000,
  })
  @IsString()
  @MinLength(20)
  @MaxLength(4000)
  contenido!: string;

  @ApiProperty({ example: ['bullying', 'prevencion', 'convivencia'] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  temas!: string[];

  @ApiProperty({
    enum: ['docentes', 'equipo_psicologia', 'mixto'],
    example: 'docentes',
  })
  @IsIn(['docentes', 'equipo_psicologia', 'mixto'])
  publicoObjetivo!: 'docentes' | 'equipo_psicologia' | 'mixto';
}
