import { Inject, Injectable } from '@nestjs/common';
import { generarIdSeguro } from '../../../shared/domain/id-generator';
import { AuditLog } from '../../domain/entities/audit-log.entity';
import { AUDIT_REPOSITORY, AuditRepository } from '../../domain/repositories/audit.repository';

export interface RegisterAuditInput {
  actorUserId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
  ip?: string | null;
}

@Injectable()
export class AuditService {
  constructor(
    @Inject(AUDIT_REPOSITORY)
    private readonly auditRepository: AuditRepository,
  ) {}

  async register(input: RegisterAuditInput): Promise<void> {
    await this.auditRepository.create(
      new AuditLog({
        id: generarIdSeguro('aud'),
        actorUserId: input.actorUserId ?? null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        metadata: this.stripSensitiveMetadata(input.metadata ?? {}),
        ip: input.ip ?? null,
        createdAt: new Date(),
      }),
    );
  }

  async list() {
    const logs = await this.auditRepository.list();
    return logs.map((log) => ({
      id: log.id,
      actor_user_id: log.actorUserId,
      action: log.action,
      entity_type: log.entityType,
      entity_id: log.entityId,
      metadata: log.metadata,
      ip: log.ip,
      created_at: log.createdAt.toISOString(),
    }));
  }

  private stripSensitiveMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
    const blocked = new Set(['message_text', 'password', 'password_hash', 'observation_internal']);
    return Object.fromEntries(
      Object.entries(metadata).filter(([key]) => !blocked.has(key.toLowerCase())),
    );
  }
}
