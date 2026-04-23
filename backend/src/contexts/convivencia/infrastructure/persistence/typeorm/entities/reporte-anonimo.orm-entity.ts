import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reportes_anonimos')
export class ReporteAnonimoOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'fecha_reporte', type: 'timestamptz' })
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

  @Column({ length: 20 })
  estado!: string;
}
