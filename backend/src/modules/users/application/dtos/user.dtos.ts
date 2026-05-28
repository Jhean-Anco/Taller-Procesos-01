import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { InternalUserRole } from '../../../shared/domain/enums';

export class CreateInternalUserDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsEnum(InternalUserRole)
  role!: InternalUserRole;
}

export class UpdateInternalUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(InternalUserRole)
  role?: InternalUserRole;
}

export class UpdateUserStatusDto {
  @IsBoolean()
  active!: boolean;
}

export interface InternalUserResponseDto {
  id: string;
  name: string;
  email: string;
  role: InternalUserRole;
  active: boolean;
  created_at: string;
  updated_at: string;
}
