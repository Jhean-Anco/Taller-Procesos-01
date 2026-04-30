import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class RegistrarEncuestaDto {
  @IsString()
  @IsNotEmpty()
  textoEmocional!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  nivelAnimo!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  nivelSeguridad!: number;
}
