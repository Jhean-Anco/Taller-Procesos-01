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
import { AlertaOrmEntidad } from './alerta.orm-entidad';
import { AvanceProcesoAdministrativoOrmEntidad } from './avance-proceso-administrativo.orm-entidad';
import { UsuarioOrmEntidad } from './usuario.orm-entidad';

@Entity({ name: 'procesos_administrativos' })
export class ProcesoAdministrativoOrmEntidad {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'alerta_id', type: 'uuid' })
  alertaId!: string;

  @Column({ name: 'administrativo_id', type: 'uuid' })
  administrativoId!: string;

  @Column({ name: 'accion_institucional', type: 'text' })
  accionInstitucional!: string;

  @Column({ name: 'descripcion_inicial', type: 'text' })
  descripcionInicial!: string;

  @Column({ type: 'varchar', length: 140, nullable: true })
  responsable!: string | null;

  @Column({ name: 'fecha_objetivo', type: 'timestamp', nullable: true })
  fechaObjetivo!: Date | null;

  @Column({ type: 'varchar', length: 20 })
  estado!: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion!: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion!: Date;

  @ManyToOne(() => AlertaOrmEntidad, (alerta) => alerta.procesosAdministrativos, {
    nullable: false,
  })
  @JoinColumn({ name: 'alerta_id' })
  alerta!: AlertaOrmEntidad;

  @ManyToOne(() => UsuarioOrmEntidad, (usuario) => usuario.procesosAdministrativos, {
    nullable: false,
  })
  @JoinColumn({ name: 'administrativo_id' })
  administrativo!: UsuarioOrmEntidad;

  @OneToMany(
    () => AvanceProcesoAdministrativoOrmEntidad,
    (avance) => avance.procesoAdministrativo,
  )
  avances!: AvanceProcesoAdministrativoOrmEntidad[];
}
