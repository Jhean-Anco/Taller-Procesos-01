import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'psicologia@colegio.edu',
    description: 'Correo institucional del usuario.',
  })
  @IsEmail()
  correo!: string;

  @ApiProperty({
    example: 'ClaveSegura123',
    minLength: 8,
    description: 'Contrasena institucional del usuario.',
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
