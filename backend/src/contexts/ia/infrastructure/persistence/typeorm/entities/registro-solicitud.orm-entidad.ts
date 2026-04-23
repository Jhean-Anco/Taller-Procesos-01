import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('registros_solicitudes_ia')
export class RegistroSolicitudOrmEntidad {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  prompt!: string;

  @Column({ type: 'text' })
  respuesta!: string;

  @Column({ length: 120 })
  modelo!: string;

  @Column({ length: 40, name: 'rol_solicitante' })
  rolSolicitante!: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn!: Date;
}
