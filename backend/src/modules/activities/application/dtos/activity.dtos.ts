import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PreventiveActivityStatus } from '../../../shared/domain/enums';

export class CreatePreventiveActivityDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  report_id?: string;

  @IsString()
  @MaxLength(180)
  title!: string;

  @IsString()
  @MaxLength(2000)
  description!: string;

  @IsString()
  @MaxLength(800)
  objective!: string;

  @IsString()
  @MaxLength(120)
  activity_type!: string;

  @IsString()
  @MaxLength(160)
  responsible!: string;

  @IsDateString()
  scheduled_date!: string;
}

export class UpdatePreventiveActivityDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  report_id?: string | null;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  objective?: string;

  @IsOptional()
  @IsString()
  activity_type?: string;

  @IsOptional()
  @IsString()
  responsible?: string;

  @IsOptional()
  @IsDateString()
  scheduled_date?: string;

  @IsOptional()
  @IsEnum(PreventiveActivityStatus)
  status?: PreventiveActivityStatus;
}

export class UpdatePreventiveActivityStatusDto {
  @IsEnum(PreventiveActivityStatus)
  status!: PreventiveActivityStatus;
}
