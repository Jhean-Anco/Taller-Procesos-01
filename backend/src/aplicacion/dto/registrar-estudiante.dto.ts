import { IsNotEmpty, IsString, Length } from 'class-validator';

export class RegistrarEstudianteDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  codigoAnonimo!: string;
}
