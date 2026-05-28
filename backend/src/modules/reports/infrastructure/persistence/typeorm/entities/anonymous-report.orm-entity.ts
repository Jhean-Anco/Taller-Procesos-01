import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { ReportStatus } from '../../../../../shared/domain/enums';

@Entity('anonymous_reports')
export class AnonymousReportOrmEntity {
  @PrimaryColumn('varchar', { length: 64 })
  id!: string;

  @Column('varchar', { name: 'public_code', length: 40, unique: true })
  publicCode!: string;

  @Column('varchar', { name: 'grade_reference', length: 40, nullable: true })
  gradeReference!: string | null;

  @Column('varchar', { name: 'section_reference', length: 20, nullable: true })
  sectionReference!: string | null;

  @Column('varchar', { name: 'age_range', length: 30, nullable: true })
  ageRange!: string | null;

  @Column('jsonb', { name: 'emotional_form' })
  emotionalForm!: Record<string, unknown>;

  @Column('text', { name: 'message_text' })
  messageText!: string;

  @Column('boolean', { name: 'consent_accepted' })
  consentAccepted!: boolean;

  @Column('varchar', { length: 20 })
  status!: ReportStatus;

  @Column('varchar', { name: 'analysis_queue_status', length: 20, default: 'PENDING' })
  analysisQueueStatus!: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

  @Column('int', { name: 'analysis_attempts', default: 0 })
  analysisAttempts!: number;

  @Column('timestamp', { name: 'analysis_next_attempt_at', nullable: true })
  analysisNextAttemptAt!: Date | null;

  @Column('text', { name: 'analysis_last_error', nullable: true })
  analysisLastError!: string | null;

  @Column('timestamp', { name: 'analysis_requested_at', default: () => 'now()' })
  analysisRequestedAt!: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
