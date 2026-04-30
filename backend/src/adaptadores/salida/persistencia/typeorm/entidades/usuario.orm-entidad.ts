import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AlertaOrmEntidad } from './alerta.orm-entidad';
import { AvanceProcesoAdministrativoOrmEntidad } from './avance-proceso-administrativo.orm-entidad';
import { ProcesoAdministrativoOrmEntidad } from './proceso-administrativo.orm-entidad';
import { EstudianteOrmEntidad } from './estudiante.orm-entidad';
import { SeguimientoAlertaOrmEntidad } from './seguimiento-alerta.orm-entidad';

@Entity({ name: 'usuarios' })
export class UsuarioOrmEntidad {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'nombre_usuario', unique: true, length: 60 })
  nombreUsuario!: string;

  @Column({ name: 'clave_hash', length: 255 })
  claveHash!: string;

  @Column({ length: 30 })
  rol!: string;

  @Column({ default: true })
  activo!: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion!: Date;

  @OneToOne(() => EstudianteOrmEntidad, (estudiante) => estudiante.usuario)
  estudiante!: EstudianteOrmEntidad | null;

  @OneToMany(() => AlertaOrmEntidad, (alerta) => alerta.psicologoAsignado)
  alertasAsignadas!: AlertaOrmEntidad[];

  @OneToMany(() => SeguimientoAlertaOrmEntidad, (seguimiento) => seguimiento.psicologo)
  seguimientos!: SeguimientoAlertaOrmEntidad[];

  @OneToMany(
    () => ProcesoAdministrativoOrmEntidad,
    (proceso) => proceso.administrativo,
  )
  procesosAdministrativos!: ProcesoAdministrativoOrmEntidad[];

  @OneToMany(
    () => AvanceProcesoAdministrativoOrmEntidad,
    (avance) => avance.administrativo,
  )
  avancesProcesosAdministrativos!: AvanceProcesoAdministrativoOrmEntidad[];
}
