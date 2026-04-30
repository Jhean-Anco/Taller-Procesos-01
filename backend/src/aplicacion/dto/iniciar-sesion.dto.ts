import { IsNotEmpty, IsString } from 'class-validator';

export class IniciarSesionDto {
  @IsString()
  @IsNotEmpty()
  nombreUsuario!: string;

  @IsString()
  @IsNotEmpty()
  claveAcceso!: string;
}
