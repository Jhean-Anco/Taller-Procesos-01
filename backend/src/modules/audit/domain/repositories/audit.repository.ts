import { AuditLog } from '../entities/audit-log.entity';

export const AUDIT_REPOSITORY = Symbol('AUDIT_REPOSITORY');

export interface AuditRepository {
  create(log: AuditLog): Promise<AuditLog>;
  list(): Promise<AuditLog[]>;
}
