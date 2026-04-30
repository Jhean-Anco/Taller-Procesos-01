import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AlertaOrmEntidad } from './alerta.orm-entidad';
import { EstudianteOrmEntidad } from './estudiante.orm-entidad';

@Entity({ name: 'encuestas_emocionales' })
export class EncuestaEmocionalOrmEntidad {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'estudiante_id', type: 'uuid' })
  estudianteId!: string;

  @Column({ name: 'texto_emocional', type: 'text' })
  textoEmocional!: string;

  @Column({ name: 'nivel_animo', type: 'int' })
  nivelAnimo!: number;

  @Column({ name: 'nivel_seguridad', type: 'int' })
  nivelSeguridad!: number;

  @Column({ name: 'puntaje_riesgo', type: 'int', default: 0 })
  puntajeRiesgo!: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion!: Date;

  @ManyToOne(() => EstudianteOrmEntidad, (estudiante) => estudiante.encuestas, {
    nullable: false,
  })
  @JoinColumn({ name: 'estudiante_id' })
  estudiante!: EstudianteOrmEntidad;

  @OneToMany(() => AlertaOrmEntidad, (alerta) => alerta.encuesta)
  alertas!: AlertaOrmEntidad[];
}
