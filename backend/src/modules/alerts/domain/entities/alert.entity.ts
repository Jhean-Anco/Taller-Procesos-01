import {
  AlertGeneratedBy,
  AlertStatus,
  RiskLevel,
} from '../../../shared/domain/enums';

export interface AlertProps {
  id: string;
  reportId: string;
  riskLevel: RiskLevel;
  status: AlertStatus;
  generatedBy: AlertGeneratedBy;
  createdAt: Date;
  updatedAt: Date;
}

export class Alert {
  constructor(private readonly props: AlertProps) {}

  get id(): string {
    return this.props.id;
  }

  get reportId(): string {
    return this.props.reportId;
  }

  get riskLevel(): RiskLevel {
    return this.props.riskLevel;
  }

  get status(): AlertStatus {
    return this.props.status;
  }

  get generatedBy(): AlertGeneratedBy {
    return this.props.generatedBy;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateStatus(status: AlertStatus): Alert {
    return new Alert({
      ...this.props,
      status,
      updatedAt: new Date(),
    });
  }

  updateRisk(riskLevel: RiskLevel, generatedBy: AlertGeneratedBy): Alert {
    return new Alert({
      ...this.props,
      riskLevel,
      generatedBy,
      updatedAt: new Date(),
    });
  }

  toPrimitives(): AlertProps {
    return { ...this.props };
  }
}
