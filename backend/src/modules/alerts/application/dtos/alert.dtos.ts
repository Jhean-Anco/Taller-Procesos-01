import { IsEnum, IsOptional } from 'class-validator';
import { AlertStatus, RiskLevel } from '../../../shared/domain/enums';

export class AlertFiltersDto {
  @IsOptional()
  @IsEnum(AlertStatus)
  status?: AlertStatus;

  @IsOptional()
  @IsEnum(RiskLevel)
  risk_level?: RiskLevel;
}

export class UpdateAlertStatusDto {
  @IsEnum(AlertStatus)
  status!: AlertStatus;
}
