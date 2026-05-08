import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

export class RegistrarEncuestaDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  textoEmocional!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  nivelAnimo!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  nivelSeguridad!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  grado?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  zonaJunin?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  recreoSolo?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  miedoParticipar?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  redesSociales?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  apoyoFamiliar?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  rendimiento?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  habilidadesSociales?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  entornoViolento?: number;
}
