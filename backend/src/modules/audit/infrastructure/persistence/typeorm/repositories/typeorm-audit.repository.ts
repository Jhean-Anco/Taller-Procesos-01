import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../../../domain/entities/audit-log.entity';
import { AuditRepository } from '../../../../domain/repositories/audit.repository';
import { AuditLogOrmEntity } from '../entities/audit-log.orm-entity';

@Injectable()
export class TypeOrmAuditRepository implements AuditRepository {
  constructor(
    @InjectRepository(AuditLogOrmEntity)
    private readonly repository: Repository<AuditLogOrmEntity>,
  ) {}

  async create(log: AuditLog): Promise<AuditLog> {
    const props = log.toPrimitives();
    const saved = await this.repository.save({ ...props });
    return this.toDomain(saved);
  }

  async list(): Promise<AuditLog[]> {
    const rows = await this.repository.find({ order: { createdAt: 'DESC' }, take: 500 });
    return rows.map((row) => this.toDomain(row));
  }

  private toDomain(entity: AuditLogOrmEntity): AuditLog {
    return new AuditLog({
      id: entity.id,
      actorUserId: entity.actorUserId,
      action: entity.action,
      entityType: entity.entityType,
      entityId: entity.entityId,
      metadata: entity.metadata,
      ip: entity.ip,
      createdAt: entity.createdAt,
    });
  }
}
