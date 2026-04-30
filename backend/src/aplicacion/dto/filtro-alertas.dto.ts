import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class FiltroAlertasDto {
  @IsOptional()
  @IsIn(['pendiente', 'evaluacion', 'cerrada'])
  estado?: 'pendiente' | 'evaluacion' | 'cerrada';

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  riesgoMinimo?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  riesgoMaximo?: number;

  @IsOptional()
  @IsString()
  fechaDesde?: string;

  @IsOptional()
  @IsString()
  fechaHasta?: string;
}
