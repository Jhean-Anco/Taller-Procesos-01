import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuarios_institucionales')
export class UsuarioInstitucionalOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 150 })
  nombre!: string;

  @Column({ length: 180, unique: true })
  correo!: string;

  @Column({ length: 40 })
  rol!: string;

  @Column({ length: 120 })
  area!: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash!: string;

  @Column({ default: true })
  activo!: boolean;
}
