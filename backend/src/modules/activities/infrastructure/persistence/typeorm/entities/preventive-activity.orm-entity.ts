import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { PreventiveActivityStatus } from '../../../../../shared/domain/enums';

@Entity('preventive_activities')
export class PreventiveActivityOrmEntity {
  @PrimaryColumn('varchar', { length: 64 })
  id!: string;

  @Column('varchar', { length: 180 })
  title!: string;

  @Column('text')
  description!: string;

  @Column('text')
  objective!: string;

  @Column('varchar', { name: 'activity_type', length: 120 })
  activityType!: string;

  @Column('varchar', { length: 160 })
  responsible!: string;

  @Column('timestamp', { name: 'scheduled_date' })
  scheduledDate!: Date;

  @Column('varchar', { length: 30 })
  status!: PreventiveActivityStatus;

  @Column('varchar', { name: 'created_by', length: 64 })
  createdBy!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
