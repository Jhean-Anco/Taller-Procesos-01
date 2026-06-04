import { PreventiveActivityStatus } from '../../../shared/domain/enums';

export interface PreventiveActivityProps {
  id: string;
  reportId?: string | null;
  title: string;
  description: string;
  objective: string;
  activityType: string;
  responsible: string;
  scheduledDate: Date;
  status: PreventiveActivityStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PreventiveActivity {
  constructor(private readonly props: PreventiveActivityProps) {}

  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get reportId(): string | null | undefined {
    return this.props.reportId;
  }

  get description(): string {
    return this.props.description;
  }

  get objective(): string {
    return this.props.objective;
  }

  get activityType(): string {
    return this.props.activityType;
  }

  get responsible(): string {
    return this.props.responsible;
  }

  get scheduledDate(): Date {
    return this.props.scheduledDate;
  }

  get status(): PreventiveActivityStatus {
    return this.props.status;
  }

  get createdBy(): string {
    return this.props.createdBy;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  update(data: Partial<Omit<PreventiveActivityProps, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>>): PreventiveActivity {
    return new PreventiveActivity({ ...this.props, ...data, updatedAt: new Date() });
  }

  changeStatus(status: PreventiveActivityStatus): PreventiveActivity {
    return new PreventiveActivity({ ...this.props, status, updatedAt: new Date() });
  }

  toPrimitives(): PreventiveActivityProps {
    return { ...this.props };
  }
}
