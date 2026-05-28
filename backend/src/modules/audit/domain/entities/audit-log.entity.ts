export interface AuditLogProps {
  id: string;
  actorUserId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata: Record<string, unknown>;
  ip?: string | null;
  createdAt: Date;
}

export class AuditLog {
  constructor(private readonly props: AuditLogProps) {}

  get id(): string {
    return this.props.id;
  }

  get actorUserId(): string | null | undefined {
    return this.props.actorUserId;
  }

  get action(): string {
    return this.props.action;
  }

  get entityType(): string {
    return this.props.entityType;
  }

  get entityId(): string | null | undefined {
    return this.props.entityId;
  }

  get metadata(): Record<string, unknown> {
    return { ...this.props.metadata };
  }

  get ip(): string | null | undefined {
    return this.props.ip;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  toPrimitives(): AuditLogProps {
    return { ...this.props, metadata: { ...this.props.metadata } };
  }
}
