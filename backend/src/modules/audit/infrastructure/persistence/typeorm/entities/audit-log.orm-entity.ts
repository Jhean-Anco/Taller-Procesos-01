import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLogOrmEntity {
  @PrimaryColumn('varchar', { length: 64 })
  id!: string;

  @Column('varchar', { name: 'actor_user_id', length: 64, nullable: true })
  actorUserId!: string | null;

  @Column('varchar', { length: 120 })
  action!: string;

  @Column('varchar', { name: 'entity_type', length: 80 })
  entityType!: string;

  @Column('varchar', { name: 'entity_id', length: 64, nullable: true })
  entityId!: string | null;

  @Column('jsonb', { default: {} })
  metadata!: Record<string, unknown>;

  @Column('varchar', { length: 80, nullable: true })
  ip!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
