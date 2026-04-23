import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IntervencionOrmEntity } from './intervencion.orm-entity';

@Entity('incidencias_psicologicas')
export class IncidenciaPsicologicaOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 30 })
  origen!: string;

  @Column({ name: 'fecha_incidencia', type: 'timestamptz' })
  fecha!: Date;

  @Column({ name: 'nivel_escolar', length: 20 })
  nivelEscolar!: string;

  @Column({ length: 30 })
  grado!: string;

  @Column({ length: 30 })
  seccion!: string;

  @Column({ name: 'tipo_incidencia', length: 60 })
  tipoIncidencia!: string;

  @Column({ type: 'text' })
  descripcion!: string;

  @Column({ name: 'nivel_alerta', length: 20 })
  nivelAlerta!: string;

  @Column({ name: 'alerta_critica', default: false })
  alertaCritica!: boolean;

  @Column({ length: 30 })
  estado!: string;

  @Column({ name: 'total_reportes_relacionados', default: 0 })
  totalReportesRelacionados!: number;

  @OneToMany(
    () => IntervencionOrmEntity,
    (intervencion) => intervencion.incidencia,
    {
      cascade: false,
      eager: true,
    },
  )
  intervenciones!: IntervencionOrmEntity[];
}
