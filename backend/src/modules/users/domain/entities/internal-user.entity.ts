import { InternalUserRole } from '../../../shared/domain/enums';

export interface InternalUserProps {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: InternalUserRole;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class InternalUser {
  constructor(private readonly props: InternalUserProps) {}

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get role(): InternalUserRole {
    return this.props.role;
  }

  get active(): boolean {
    return this.props.active;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  update(data: Partial<Pick<InternalUserProps, 'name' | 'email' | 'role'>>): InternalUser {
    return new InternalUser({
      ...this.props,
      ...data,
      email: data.email?.toLowerCase() ?? this.props.email,
      updatedAt: new Date(),
    });
  }

  changeStatus(active: boolean): InternalUser {
    return new InternalUser({
      ...this.props,
      active,
      updatedAt: new Date(),
    });
  }

  toPrimitives(): InternalUserProps {
    return { ...this.props };
  }
}
