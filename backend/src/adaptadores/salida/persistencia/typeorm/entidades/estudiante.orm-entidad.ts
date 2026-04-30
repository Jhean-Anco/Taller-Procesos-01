import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EncuestaEmocionalOrmEntidad } from './encuesta-emocional.orm-entidad';
import { UsuarioOrmEntidad } from './usuario.orm-entidad';

@Entity({ name: 'estudiantes' })
export class EstudianteOrmEntidad {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'usuario_id', type: 'uuid', unique: true, nullable: true })
  usuarioId!: string | null;

  @Column({ name: 'codigo_anonimo', unique: true, length: 30 })
  codigoAnonimo!: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion!: Date;

  @OneToMany(() => EncuestaEmocionalOrmEntidad, (encuesta) => encuesta.estudiante)
  encuestas!: EncuestaEmocionalOrmEntidad[];

  @OneToOne(() => UsuarioOrmEntidad, (usuario) => usuario.estudiante, {
    nullable: true,
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario!: UsuarioOrmEntidad | null;
}
