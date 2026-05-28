import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { DerivationStatus } from '../../../../../shared/domain/enums';

@Entity('derivations')
export class DerivationOrmEntity {
  @PrimaryColumn('varchar', { length: 64 })
  id!: string;

  @Column('varchar', { name: 'report_id', length: 64 })
  reportId!: string;

  @Column('varchar', { name: 'psychologist_id', length: 64 })
  psychologistId!: string;

  @Column('varchar', { name: 'admin_director_id', length: 64, nullable: true })
  adminDirectorId!: string | null;

  @Column('text', { name: 'non_sensitive_summary' })
  nonSensitiveSummary!: string;

  @Column('varchar', { length: 30 })
  status!: DerivationStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
