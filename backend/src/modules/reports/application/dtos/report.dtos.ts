import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ReportStatus, RiskLevel } from '../../../shared/domain/enums';

export class CreateAnonymousReportDto {
  @IsOptional()
  @IsString()
  @MaxLength(40)
  grade_reference?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  section_reference?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  age_range?: string;

  @IsObject()
  emotional_form!: Record<string, unknown>;

  @IsString()
  @MinLength(10)
  @MaxLength(4000)
  message_text!: string;

  @IsBoolean()
  consent_accepted!: boolean;
}

export class ReportFiltersDto {
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @IsOptional()
  @IsEnum(RiskLevel)
  risk?: RiskLevel;

  @IsOptional()
  @IsString()
  dominant_emotion?: string;

  @IsOptional()
  @IsDateString()
  date_from?: string;

  @IsOptional()
  @IsDateString()
  date_to?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class ReviewReportDto {
  @IsEnum(RiskLevel)
  validated_risk!: RiskLevel;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  observation_internal?: string;
}

export class UpdateReportStatusDto {
  @IsEnum(ReportStatus)
  status!: ReportStatus;
}

export class DeriveReportDto {
  @IsOptional()
  @IsString()
  @MaxLength(800)
  non_sensitive_summary?: string;

  @IsOptional()
  @IsString()
  admin_director_id?: string;
}

export class ProcessAnalysisQueueDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}

export class ArchiveReportDto {
  @IsString()
  @MinLength(8)
  @MaxLength(500)
  reason!: string;
}
