import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProcesoAdministrativoOrmEntidad } from './proceso-administrativo.orm-entidad';
import { UsuarioOrmEntidad } from './usuario.orm-entidad';

@Entity({ name: 'avances_procesos_administrativos' })
export class AvanceProcesoAdministrativoOrmEntidad {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'proceso_administrativo_id', type: 'uuid' })
  procesoAdministrativoId!: string;

  @Column({ name: 'administrativo_id', type: 'uuid' })
  administrativoId!: string;

  @Column({ name: 'descripcion_avance', type: 'text' })
  descripcionAvance!: string;

  @Column({ type: 'varchar', length: 20 })
  tipo!: string;

  @Column({ type: 'varchar', length: 20 })
  estado!: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion!: Date;

  @ManyToOne(
    () => ProcesoAdministrativoOrmEntidad,
    (procesoAdministrativo) => procesoAdministrativo.avances,
    { nullable: false },
  )
  @JoinColumn({ name: 'proceso_administrativo_id' })
  procesoAdministrativo!: ProcesoAdministrativoOrmEntidad;

  @ManyToOne(
    () => UsuarioOrmEntidad,
    (usuario) => usuario.avancesProcesosAdministrativos,
    { nullable: false },
  )
  @JoinColumn({ name: 'administrativo_id' })
  administrativo!: UsuarioOrmEntidad;
}
