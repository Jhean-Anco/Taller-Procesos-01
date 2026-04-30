import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AlertaOrmEntidad } from './alerta.orm-entidad';
import { UsuarioOrmEntidad } from './usuario.orm-entidad';

@Entity({ name: 'seguimientos_alerta' })
export class SeguimientoAlertaOrmEntidad {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'alerta_id', type: 'uuid' })
  alertaId!: string;

  @Column({ name: 'psicologo_id', type: 'uuid' })
  psicologoId!: string;

  @Column({ name: 'accion_global', type: 'text' })
  accionGlobal!: string;

  @Column({ type: 'text' })
  descripcion!: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion!: Date;

  @ManyToOne(() => AlertaOrmEntidad, (alerta) => alerta.seguimientos, {
    nullable: false,
  })
  @JoinColumn({ name: 'alerta_id' })
  alerta!: AlertaOrmEntidad;

  @ManyToOne(() => UsuarioOrmEntidad, (usuario) => usuario.seguimientos, {
    nullable: false,
  })
  @JoinColumn({ name: 'psicologo_id' })
  psicologo!: UsuarioOrmEntidad;
}
