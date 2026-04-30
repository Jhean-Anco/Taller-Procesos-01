import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegistrarProcesoAdministrativoDto {
  @IsString()
  @IsNotEmpty()
  accionInstitucional!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  descripcionInicial!: string;

  @IsOptional()
  @IsString()
  responsable?: string;

  @IsOptional()
  @IsDateString()
  fechaObjetivo?: string;

  @IsIn(['pendiente', 'en_proceso', 'completado'])
  estado!: 'pendiente' | 'en_proceso' | 'completado';
}
