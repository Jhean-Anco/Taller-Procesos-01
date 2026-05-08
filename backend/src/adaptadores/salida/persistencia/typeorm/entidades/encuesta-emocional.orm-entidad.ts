import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AlertaOrmEntidad } from './alerta.orm-entidad';
import { EstudianteOrmEntidad } from './estudiante.orm-entidad';

@Entity({ name: 'encuestas_emocionales' })
export class EncuestaEmocionalOrmEntidad {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'estudiante_id', type: 'uuid' })
  estudianteId!: string;

  @Column({ name: 'texto_emocional', type: 'text' })
  textoEmocional!: string;

  @Column({ name: 'nivel_animo', type: 'int' })
  nivelAnimo!: number;

  @Column({ name: 'nivel_seguridad', type: 'int' })
  nivelSeguridad!: number;

  @Column({ name: 'puntaje_riesgo', type: 'int', default: 0 })
  puntajeRiesgo!: number;

  @Column({ type: 'smallint', default: 1 })
  grado!: number;

  @Column({ name: 'zona_junin', type: 'smallint', default: 1 })
  zonaJunin!: number;

  @Column({ name: 'recreo_solo', type: 'smallint', default: 0 })
  recreoSolo!: number;

  @Column({ name: 'animo_manana', type: 'smallint', default: 0 })
  animoManana!: number;

  @Column({ name: 'miedo_participar', type: 'smallint', default: 0 })
  miedoParticipar!: number;

  @Column({ name: 'redes_sociales', type: 'smallint', default: 0 })
  redesSociales!: number;

  @Column({ name: 'apoyo_familiar', type: 'smallint', default: 1 })
  apoyoFamiliar!: number;

  @Column({ type: 'smallint', default: 0 })
  rendimiento!: number;

  @Column({ name: 'habilidades_sociales', type: 'smallint', default: 1 })
  habilidadesSociales!: number;

  @Column({ name: 'entorno_violento', type: 'smallint', default: 0 })
  entornoViolento!: number;

  @Column({ name: 'evaluacion_ia_disponible', type: 'boolean', default: false })
  evaluacionIaDisponible!: boolean;

  @Column({ name: 'nivel_riesgo_ia', type: 'varchar', length: 60, nullable: true })
  nivelRiesgoIa!: string | null;

  @Column({ name: 'prioridad_atencion_ia', type: 'varchar', length: 30, nullable: true })
  prioridadAtencionIa!: string | null;

  @Column({ name: 'analisis_psicologico_ia', type: 'text', nullable: true })
  analisisPsicologicoIa!: string | null;

  @Column({ name: 'accion_recomendada_ia', type: 'text', nullable: true })
  accionRecomendadaIa!: string | null;

  @Column({ name: 'factores_detectados_ia', type: 'simple-json', nullable: true })
  factoresDetectadosIa!: string[] | null;

  @Column({ name: 'factores_protectores_ia', type: 'simple-json', nullable: true })
  factoresProtectoresIa!: string[] | null;

  @Column({ name: 'prediccion_arbol', type: 'int', nullable: true })
  prediccionArbol!: number | null;

  @Column({ name: 'sentimiento_texto_ia', type: 'varchar', length: 30, nullable: true })
  sentimientoTextoIa!: string | null;

  @Column({ name: 'confianza_texto_ia', type: 'double precision', nullable: true })
  confianzaTextoIa!: number | null;

  @Column({ name: 'confianza_global_ia', type: 'double precision', nullable: true })
  confianzaGlobalIa!: number | null;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion!: Date;

  @ManyToOne(() => EstudianteOrmEntidad, (estudiante) => estudiante.encuestas, {
    nullable: false,
  })
  @JoinColumn({ name: 'estudiante_id' })
  estudiante!: EstudianteOrmEntidad;

  @OneToMany(() => AlertaOrmEntidad, (alerta) => alerta.encuesta)
  alertas!: AlertaOrmEntidad[];
}
