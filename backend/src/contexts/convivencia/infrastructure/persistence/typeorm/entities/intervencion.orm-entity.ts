import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IncidenciaPsicologicaOrmEntity } from './incidencia-psicologica.orm-entity';

@Entity('intervenciones_psicologicas')
export class IntervencionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'fecha_intervencion', type: 'timestamptz' })
  fecha!: Date;

  @Column({ type: 'text' })
  estrategia!: string;

  @Column({ name: 'responsable_id', length: 80 })
  responsableId!: string;

  @Column({ name: 'responsable_rol', length: 40 })
  responsableRol!: string;

  @Column({ length: 30 })
  resultado!: string;

  @Column({ type: 'text' })
  observaciones!: string;

  @Column({ name: 'incidencia_id' })
  incidenciaId!: string;

  @ManyToOne(
    () => IncidenciaPsicologicaOrmEntity,
    (incidencia) => incidencia.intervenciones,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'incidencia_id' })
  incidencia!: IncidenciaPsicologicaOrmEntity;
}
