import { IsIn, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegistrarAvanceProcesoAdministrativoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  descripcionAvance!: string;

  @IsIn(['avance', 'resultado'])
  tipo!: 'avance' | 'resultado';

  @IsIn(['pendiente', 'en_proceso', 'completado'])
  estado!: 'pendiente' | 'en_proceso' | 'completado';
}
