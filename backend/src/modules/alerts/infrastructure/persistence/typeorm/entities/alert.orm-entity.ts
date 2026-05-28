import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import {
  AlertGeneratedBy,
  AlertStatus,
  RiskLevel,
} from '../../../../../shared/domain/enums';

@Entity('alerts')
export class AlertOrmEntity {
  @PrimaryColumn('varchar', { length: 64 })
  id!: string;

  @Column('varchar', { name: 'report_id', length: 64 })
  reportId!: string;

  @Column('varchar', { name: 'risk_level', length: 20 })
  riskLevel!: RiskLevel;

  @Column('varchar', { length: 20 })
  status!: AlertStatus;

  @Column('varchar', { name: 'generated_by', length: 30 })
  generatedBy!: AlertGeneratedBy;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
