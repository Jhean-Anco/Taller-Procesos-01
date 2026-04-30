import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EncuestaEmocionalOrmEntidad } from './encuesta-emocional.orm-entidad';
import { ProcesoAdministrativoOrmEntidad } from './proceso-administrativo.orm-entidad';
import { SeguimientoAlertaOrmEntidad } from './seguimiento-alerta.orm-entidad';
import { UsuarioOrmEntidad } from './usuario.orm-entidad';

@Entity({ name: 'alertas' })
export class AlertaOrmEntidad {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'encuesta_id', type: 'uuid' })
  encuestaId!: string;

  @Column({ name: 'estudiante_id', type: 'uuid' })
  estudianteId!: string;

  @Column({ name: 'psicologo_asignado_id', type: 'uuid', nullable: true })
  psicologoAsignadoId!: string | null;

  @Column({ name: 'puntaje_riesgo', type: 'int' })
  puntajeRiesgo!: number;

  @Column({ type: 'varchar', length: 20 })
  estado!: string;

  @Column({ name: 'mensaje_etico', type: 'text' })
  mensajeEtico!: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion!: Date;

  @UpdateDateColumn({ name: 'ultima_actualizacion' })
  ultimaActualizacion!: Date;

  @ManyToOne(() => EncuestaEmocionalOrmEntidad, (encuesta) => encuesta.alertas, {
    nullable: false,
  })
  @JoinColumn({ name: 'encuesta_id' })
  encuesta!: EncuestaEmocionalOrmEntidad;

  @ManyToOne(() => UsuarioOrmEntidad, (usuario) => usuario.alertasAsignadas, {
    nullable: true,
  })
  @JoinColumn({ name: 'psicologo_asignado_id' })
  psicologoAsignado!: UsuarioOrmEntidad | null;

  @OneToMany(() => SeguimientoAlertaOrmEntidad, (seguimiento) => seguimiento.alerta)
  seguimientos!: SeguimientoAlertaOrmEntidad[];

  @OneToMany(
    () => ProcesoAdministrativoOrmEntidad,
    (proceso) => proceso.alerta,
  )
  procesosAdministrativos!: ProcesoAdministrativoOrmEntidad[];
}
