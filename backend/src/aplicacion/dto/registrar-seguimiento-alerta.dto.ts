import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegistrarSeguimientoAlertaDto {
  @IsString()
  @IsNotEmpty()
  accionGlobal!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  descripcion!: string;
}
