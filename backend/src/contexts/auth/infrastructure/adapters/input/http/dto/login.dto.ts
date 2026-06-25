import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'psicologia@colegio.edu',
    description: 'Correo institucional del usuario.',
  })
  @IsOptional()
  @IsEmail()
  correo?: string;

  @ApiProperty({
    example: 'psicologia@colegio.edu',
    description: 'Alias compatible con el frontend actual.',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'ClaveSegura123',
    minLength: 8,
    description: 'Contrasena institucional del usuario.',
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
