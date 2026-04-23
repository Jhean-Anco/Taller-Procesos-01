import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('materiales_docentes')
export class MaterialDocenteOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 180 })
  titulo!: string;

  @Column({ type: 'text' })
  descripcion!: string;

  @Column({ type: 'text' })
  contenido!: string;

  @Column({ name: 'creado_por', length: 80 })
  creadoPor!: string;

  @Column('simple-array')
  temas!: string[];

  @Column({ name: 'publico_objetivo', length: 30 })
  publicoObjetivo!: string;

  @Column({ name: 'fecha_creacion', type: 'timestamptz' })
  fecha!: Date;
}
