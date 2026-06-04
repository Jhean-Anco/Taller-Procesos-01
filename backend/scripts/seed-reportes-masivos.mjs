import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Client } from 'pg';
import {
  applySchema,
  ensureDatabaseExists,
  readEnvFile,
  resolveDatabaseConfig,
} from './lib/database-setup.mjs';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const backendRoot = join(scriptDir, '..');

const fileEnv = readEnvFile(join(backendRoot, '.env'));
const env = { ...fileEnv, ...process.env };

const parsedTotal = Number(env.CARGA_TOTAL ?? 1000);
const total =
  Number.isFinite(parsedTotal) && parsedTotal > 0
    ? Math.floor(parsedTotal)
    : 1000;
const databaseConfig = resolveDatabaseConfig(env);

const client = new Client(databaseConfig);

const grades = [
  { grade_reference: 'primaria-5', age_range: '9-11' },
  { grade_reference: 'primaria-6', age_range: '10-12' },
  { grade_reference: 'secundaria-1', age_range: '12-14' },
  { grade_reference: 'secundaria-2', age_range: '12-14' },
  { grade_reference: 'secundaria-3', age_range: '13-15' },
  { grade_reference: 'secundaria-4', age_range: '15-17' },
  { grade_reference: 'secundaria-5', age_range: '15-17' },
];
const sections = ['A', 'B', 'C', 'D', 'E'];
const statuses = ['PENDING', 'PENDING', 'PENDING', 'IN_REVIEW'];
const places = [
  'en el aula',
  'durante el recreo',
  'en la salida',
  'en los pasillos',
  'en educacion fisica',
  'en un grupo de whatsapp',
  'durante un trabajo en equipo',
  'en la biblioteca',
  'al llegar temprano',
  'cuando cambio de salon',
  'en tutoria',
  'en una exposicion',
];

const lowSituations = [
  'me senti cansado y con poca concentracion',
  'tuve dudas para participar, pero pude continuar',
  'me incomodo una conversacion, aunque no fue grave',
  'me preocupe por mis notas y pedi apoyo',
  'preferi observar antes de hablar',
  'me costo integrarme al grupo ese dia',
  'estuve sensible por asuntos de casa',
  'necesite mas tiempo para ordenar mis ideas',
  'me puse nervioso por una exposicion corta',
  'quise contar que estoy intentando mejorar',
  'me senti tranquilo despues de conversar con un docente',
  'me anime a pedir ayuda para organizarme',
];
const lowRequests = [
  'quisiera orientacion para organizarme mejor',
  'me ayudaria una conversacion breve con tutoria',
  'solo deseo que sepan como me estoy sintiendo',
  'quiero mejorar mi participacion en clase',
  'pido recomendaciones para manejar el estres',
  'me gustaria que revisen el ambiente del aula',
  'quisiera actividades para integrarnos mas',
  'me serviria una estrategia para hablar con calma',
];

const mediumSituations = [
  'se burlan de mi forma de hablar',
  'me dejan solo en los recreos',
  'me insultan cuando participo',
  'circulan comentarios por whatsapp',
  'subieron fotos y eso me da ansiedad',
  'varios companeros me ignoran y me siento triste',
  'me llaman por apodos que no me gustan',
  'hacen bromas sobre mis trabajos',
  'me aislan cuando hay grupos',
  'se rien cuando me equivoco',
  'me siento observado y prefiero no participar',
  'me preocupa que las bromas sigan creciendo',
];
const mediumFeelings = [
  'tengo miedo de volver a participar',
  'siento ansiedad antes de entrar al salon',
  'me siento triste y sin ganas de hablar',
  'me quedo solo para evitar problemas',
  'no duermo bien pensando en lo que pasa',
  'me da temor pedir ayuda delante de todos',
  'siento enojo y verguenza al mismo tiempo',
  'prefiero faltar para no escuchar burlas',
];
const mediumRequests = [
  'necesito que alguien revise la convivencia del aula',
  'quisiera seguimiento antes de que empeore',
  'pido que orienten al grupo sin decir mi nombre',
  'me ayudaria hablar con psicologia',
  'necesito apoyo para sentirme seguro',
  'quisiera que observen lo que pasa en recreo',
];

const highSituations = [
  'me amenazan a la salida del colegio',
  'dijeron que van a golpearme despues de clase',
  'hubo un golpe fuerte en el pasillo',
  'alguien llevo un arma y me asusto mucho',
  'me hicieron una amenaza por redes',
  'vi sangre despues de una pelea cerca del aula',
  'siento abuso y presion para guardar silencio',
  'me dijeron que si hablo me van a hacer dano',
  'me empujan y cada dia la amenaza aumenta',
  'tengo miedo porque ya me golpearon una vez',
  'siento que la amenaza puede convertirse en un golpe',
  'me dijeron que no vuelva a pedir ayuda',
];
const highFeelings = [
  'estoy muy nervioso y no quiero ir',
  'tengo miedo intenso y necesito ayuda urgente',
  'siento angustia porque podria pasar otra vez',
  'me siento en peligro y no se que hacer',
  'tengo temor de que esto termine peor',
  'me cuesta dormir por la amenaza',
];
const highRequests = [
  'pido intervencion inmediata sin revelar mi identidad',
  'necesito que un adulto responsable revise esto hoy',
  'quiero que se active seguimiento prioritario',
  'por favor observen la salida y los pasillos',
  'necesito proteccion y una revision urgente',
];

const profiles = ['LOW_HINT', 'MEDIUM_HINT', 'HIGH_HINT'];

function pick(index, array) {
  return array[Math.abs(index) % array.length];
}

function seededRandom(seed) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function shuffleDeterministic(items, seed = 20260604) {
  const random = seededRandom(seed);
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function randomFor(index, salt) {
  return seededRandom((index + 1) * 1009 + salt)();
}

function publicCode(index) {
  return `AR-MASIVO-${String(index + 1).padStart(6, '0')}`;
}

function emotionalForm(profile, index) {
  if (profile === 'LOW_HINT') {
    return {
      fear: false,
      sadness: index % 6 === 0,
      anxiety: false,
      isolation: false,
      school_insecurity: false,
      calm: index % 3 === 0,
      motivation: index % 4 === 0,
      family_support: index % 5 !== 0,
    };
  }

  if (profile === 'MEDIUM_HINT') {
    return {
      fear: index % 3 === 0,
      sadness: index % 4 === 0,
      anxiety: index % 3 !== 1,
      isolation: index % 2 === 0,
      school_insecurity: index % 5 === 0,
      recreo_solo: index % 4 === 1 ? 1 : 0,
      miedo_participar: index % 6 === 0 ? 1 : 0,
    };
  }

  return {
    fear: index % 2 === 0,
    sadness: index % 5 === 0,
    anxiety: true,
    isolation: index % 4 === 0,
    school_insecurity: index % 3 !== 0,
    entorno_violento: 1,
    miedo_participar: index % 2,
  };
}

function buildMessage(profile, index, grade, section, ageRange) {
  const place = pick(index * 13, places);
  const trace = `Reporte anonimo ${String(index + 1).padStart(4, '0')} de ${grade} ${section}, rango ${ageRange}.`;

  if (profile === 'LOW_HINT') {
    return [
      `Quiero contar que ${place} ${pick(index * 3, lowSituations)}.`,
      `${pick(index * 5, lowRequests)}.`,
      `La situacion fue ${pick(index * 7, ['puntual', 'leve', 'pasajera', 'manejable', 'reciente'])} y quiero prevenir que se repita.`,
      trace,
    ].join(' ');
  }

  if (profile === 'MEDIUM_HINT') {
    return [
      `En ${place} ${pick(index * 3, mediumSituations)}.`,
      `${pick(index * 5, mediumFeelings)}.`,
      `La situacion me deja ${pick(index * 7, ['ansiedad', 'miedo', 'tristeza', 'inseguridad'])} y a veces prefiero quedarme solo.`,
      `${pick(index * 11, mediumRequests)}.`,
      trace,
    ].join(' ');
  }

  return [
    `Necesito ayuda porque ${place} ${pick(index * 3, highSituations)}.`,
    `${pick(index * 5, highFeelings)}.`,
    'Siento que la amenaza puede convertirse en golpe o dano si nadie interviene.',
    `${pick(index * 11, highRequests)}.`,
    trace,
  ].join(' ');
}

function buildReport(index) {
  const profile = pick(index * 17, profiles);
  const grade = pick(index * 11, grades);
  const section = pick(index * 7, sections);
  const createdAt = new Date(
    Date.now()
      - Math.floor(randomFor(index, 17) * 60) * 24 * 60 * 60 * 1000
      - Math.floor(randomFor(index, 31) * 24) * 60 * 60 * 1000
      - Math.floor(randomFor(index, 43) * 60) * 60 * 1000
      - Math.floor(randomFor(index, 59) * 60) * 1000,
  );

  return {
    seedIndex: index,
    profile,
    id: `rep_massivo_${String(index + 1).padStart(6, '0')}`,
    publicCode: publicCode(index),
    gradeReference: grade.grade_reference,
    sectionReference: section,
    ageRange: grade.age_range,
    emotionalForm: emotionalForm(profile, index),
    messageText: buildMessage(
      profile,
      index,
      grade.grade_reference,
      section,
      grade.age_range,
    ),
    status: pick(index * 19, statuses),
    createdAt,
    updatedAt: createdAt,
  };
}

function increment(map, key) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

async function main() {
  await ensureDatabaseExists(databaseConfig);
  await client.connect();
  await applySchema(client);
  console.log(`Insertando ${total} reportes anonimos variados sin procesar IA...`);

  const reports = shuffleDeterministic(
    Array.from({ length: total }, (_, index) => buildReport(index)),
  );
  const profileDistribution = new Map();
  const gradeDistribution = new Map();
  const ageDistribution = new Map();
  let inserted = 0;

  await client.query('BEGIN');
  try {
    const [previousMassiveLoad] = (
      await client.query(
        "SELECT COUNT(*)::int AS total FROM anonymous_reports WHERE id LIKE 'rep_massivo_%'",
      )
    ).rows;
    await client.query('CALL sp_limpiar_carga_reportes_masivos()');
    if (previousMassiveLoad.total > 0) {
      console.log(
        `  ${previousMassiveLoad.total} reportes masivos previos retirados`,
      );
    }

    for (const report of reports) {
      await client.query(
        `
          INSERT INTO anonymous_reports (
            id,
            public_code,
            grade_reference,
            section_reference,
            age_range,
            emotional_form,
            message_text,
            consent_accepted,
            status,
            analysis_queue_status,
            analysis_attempts,
            analysis_next_attempt_at,
            analysis_last_error,
            analysis_requested_at,
            created_at,
            updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
          )
        `,
        [
          report.id,
          report.publicCode,
          report.gradeReference,
          report.sectionReference,
          report.ageRange,
          JSON.stringify(report.emotionalForm),
          report.messageText,
          true,
          report.status,
          'PENDING',
          0,
          null,
          null,
          report.createdAt,
          report.createdAt,
          report.updatedAt,
        ],
      );

      increment(profileDistribution, report.profile);
      increment(gradeDistribution, report.gradeReference);
      increment(ageDistribution, report.ageRange);
      inserted += 1;

      if (inserted % 50 === 0 || inserted === total) {
        console.log(`  ${inserted}/${total} insertados`);
      }
    }

    const [validation] = (
      await client.query('SELECT * FROM sp_validar_carga_reportes_masivos($1)', [
        total,
      ])
    ).rows;
    if (!validation?.carga_exitosa) {
      throw new Error(
        validation?.observacion ??
          'No se pudo validar la carga masiva para psicologia',
      );
    }

    console.log(
      `  Validacion: ${validation.total_masivos} masivos, ${validation.total_visibles_psicologo} visibles, ${validation.analisis_masivos} analisis IA, ${validation.pendientes_ia} pendientes`,
    );
    console.log(`  ${validation.observacion}`);
    console.log(`  Perfiles de texto: ${JSON.stringify(Object.fromEntries(profileDistribution))}`);
    console.log(`  Grados: ${JSON.stringify(Object.fromEntries(gradeDistribution))}`);
    console.log(`  Rangos edad: ${JSON.stringify(Object.fromEntries(ageDistribution))}`);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }

  await client.end();
  console.log('Carga masiva finalizada. La IA se ejecutara al abrir el detalle de cada reporte.');
}

main().catch(async (error) => {
  try {
    await client.end();
  } catch {
    void 0;
  }
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
