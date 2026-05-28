import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { RiskLevel } from '../../../../../shared/domain/enums';

@Entity('psychological_reviews')
export class PsychologicalReviewOrmEntity {
  @PrimaryColumn('varchar', { length: 64 })
  id!: string;

  @Column('varchar', { name: 'report_id', length: 64 })
  reportId!: string;

  @Column('varchar', { name: 'psychologist_id', length: 64 })
  psychologistId!: string;

  @Column('varchar', { name: 'validated_risk', length: 20 })
  validatedRisk!: RiskLevel;

  @Column('text', { name: 'observation_internal', nullable: true })
  observationInternal!: string | null;

  @CreateDateColumn({ name: 'reviewed_at' })
  reviewedAt!: Date;
}
