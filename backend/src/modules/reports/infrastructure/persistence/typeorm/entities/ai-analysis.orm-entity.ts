import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { RiskLevel } from '../../../../../shared/domain/enums';

@Entity('ai_analyses')
export class AiAnalysisOrmEntity {
  @PrimaryColumn('varchar', { length: 64 })
  id!: string;

  @Column('varchar', { name: 'report_id', length: 64 })
  reportId!: string;

  @Column('varchar', { name: 'dominant_emotion', length: 80 })
  dominantEmotion!: string;

  @Column('jsonb', { name: 'emotion_scores', default: {} })
  emotionScores!: Record<string, number>;

  @Column('varchar', { name: 'risk_ai', length: 20 })
  riskAi!: RiskLevel;

  @Column('decimal', { precision: 5, scale: 4, nullable: true })
  confidence!: number | null;

  @Column('jsonb', { name: 'relevant_signals', default: [] })
  relevantSignals!: string[];

  @Column('varchar', { name: 'model_version', length: 120 })
  modelVersion!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
