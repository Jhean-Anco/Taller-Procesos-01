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

const total = Math.max(1, Number(env.CARGA_TOTAL ?? 500));
const databaseConfig = resolveDatabaseConfig(env);

const client = new Client(databaseConfig);

const themes = [
  {
    grade_reference: 'secundaria-1',
    section_reference: 'A',
    age_range: '12-14',
    emotional_form: { fear: true, anxiety: true },
    messages: [
      'Me da miedo entrar al salon porque me molestan en el recreo y siento mucha ansiedad.',
      'No quiero participar en clase porque me insultan y me siento solo.',
      'Me preocupa ir al colegio porque se burlan de mi y tengo miedo de hablar.',
    ],
  },
  {
    grade_reference: 'secundaria-3',
    section_reference: 'B',
    age_range: '15-17',
    emotional_form: { sadness: true, isolation: true },
    messages: [
      'Me siento triste y aislado, casi nadie me habla y prefiero estar solo.',
      'A veces lloro en silencio porque siento que no encajo con el grupo.',
      'No tengo ganas de ir al colegio porque me ignoran y me siento mal.',
    ],
  },
  {
    grade_reference: 'secundaria-5',
    section_reference: 'C',
    age_range: '15-17',
    emotional_form: { fear: true, school_insecurity: true, anxiety: true },
    messages: [
      'Tengo miedo de asistir porque siento inseguridad y me intimidan en los pasillos.',
      'Me insultan por redes y eso me deja con mucha ansiedad antes de entrar a clase.',
      'Siento temor de participar porque ya me han humillado frente a todos.',
    ],
  },
];

function pick(index, array) {
  return array[index % array.length];
}

function uniquePublicCode(index) {
  return `AR-${String(index + 1).padStart(6, '0')}`;
}

async function main() {
  await ensureDatabaseExists(databaseConfig);
  await client.connect();
  await applySchema(client);
  console.log(`Insertando ${total} reportes anonimos directamente en la BD...`);

  const now = new Date();
  let inserted = 0;

  for (let index = 0; index < total; index += 1) {
    const theme = pick(index, themes);
    const publicCode = uniquePublicCode(index);
    const messageText = `${pick(index, theme.messages)} Caso ${String(index + 1).padStart(3, '0')}.`;
    const id = `rep_massivo_${String(index + 1).padStart(6, '0')}`;

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
        id,
        publicCode,
        theme.grade_reference,
        theme.section_reference,
        theme.age_range,
        JSON.stringify(theme.emotional_form),
        messageText,
        true,
        'PENDING',
        'PENDING',
        0,
        null,
        null,
        now,
        now,
        now,
      ],
    );
    inserted += 1;

    if ((index + 1) % 25 === 0 || index + 1 === total) {
      console.log(`  ${inserted}/${total} insertados`);
    }
  }

  await client.end();
  console.log('Carga masiva finalizada sin pasar por la IA.');
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
