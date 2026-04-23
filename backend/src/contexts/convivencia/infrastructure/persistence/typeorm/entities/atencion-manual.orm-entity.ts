import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('atenciones_manuales_psicologia')
export class AtencionManualOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'fecha_atencion', type: 'timestamptz' })
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

  @Column({ type: 'text' })
  observaciones!: string;

  @Column({ name: 'atendido_por', length: 80 })
  atendidoPor!: string;

  @Column({ name: 'nivel_alerta', length: 20 })
  nivelAlerta!: string;

  @Column({ name: 'alerta_critica', default: false })
  alertaCritica!: boolean;
}
