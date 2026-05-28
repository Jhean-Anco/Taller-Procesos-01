import { Injectable } from '@nestjs/common';
import { InstitutionalMemoryStore } from '../../../../shared/infrastructure/memory/institutional-memory-store';
import { AuditLog } from '../../../domain/entities/audit-log.entity';
import { AuditRepository } from '../../../domain/repositories/audit.repository';

@Injectable()
export class InMemoryAuditRepository implements AuditRepository {
  constructor(private readonly store: InstitutionalMemoryStore) {}

  create(log: AuditLog): Promise<AuditLog> {
    this.store.auditLogs.push(log);
    return Promise.resolve(log);
  }

  list(): Promise<AuditLog[]> {
    return Promise.resolve(
      [...this.store.auditLogs].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      ),
    );
  }
}
