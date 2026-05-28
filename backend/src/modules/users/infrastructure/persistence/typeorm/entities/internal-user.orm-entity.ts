import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { InternalUserRole } from '../../../../../shared/domain/enums';

@Entity('users')
export class InternalUserOrmEntity {
  @PrimaryColumn('varchar', { length: 64 })
  id!: string;

  @Column('varchar', { length: 160 })
  name!: string;

  @Column('varchar', { length: 180, unique: true })
  email!: string;

  @Column('varchar', { name: 'password_hash', length: 255 })
  passwordHash!: string;

  @Column('varchar', { length: 40 })
  role!: InternalUserRole;

  @Column('boolean', { default: true })
  active!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
