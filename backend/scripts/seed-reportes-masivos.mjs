import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { Client } from 'pg';
import {
  applySchema,
  ensureDatabaseExists,
  readEnvFile,
  resolveDatabaseConfig,
} from './lib/database-setup.mjs';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const backendRoot = join(scriptDir, '..');
const projectRoot = join(backendRoot, '..');
const defaultCasesPath = join(
  projectRoot,
  'casos_anonimos_colegio_agora_1000.json',
);
const casesPath = resolve(envPath('CASOS_ANONIMOS_JSON') ?? defaultCasesPath);

const fileEnv = readEnvFile(join(backendRoot, '.env'));
const env = { ...fileEnv, ...process.env };

const parsedTotal = Number(env.CARGA_TOTAL ?? 1000);
const requestedTotal =
  Number.isFinite(parsedTotal) && parsedTotal > 0
    ? Math.floor(parsedTotal)
    : 1000;
const databaseConfig = resolveDatabaseConfig(env);
const client = new Client(databaseConfig);
const statuses = ['PENDING', 'PENDING', 'PENDING', 'IN_REVIEW'];
const requiredEmotionKeys = [
  'fear',
  'sadness',
  'anxiety',
  'isolation',
  'school_insecurity',
];

function envPath(name) {
  return process.env[name] || undefined;
}

function publicCode(index) {
  return `AR-MASIVO-${String(index + 1).padStart(6, '0')}`;
}

function pick(index, array) {
  return array[Math.abs(index) % array.length];
}

function seededCreatedAt(index) {
  const days = (index * 17) % 60;
  const hours = (index * 7) % 24;
  const minutes = (index * 13) % 60;
  return new Date(
    Date.now()
      - days * 24 * 60 * 60 * 1000
      - hours * 60 * 60 * 1000
      - minutes * 60 * 1000,
  );
}

function fallbackCases(total) {
  return Array.from({ length: total }, (_, index) => ({
    emotional_form: {
      fear: index % 3 === 0,
      sadness: index % 4 === 0,
      anxiety: index % 2 === 0,
      isolation: index % 5 === 0,
      school_insecurity: index % 6 === 0,
    },
    message_text: `Reporte anonimo ${String(index + 1).padStart(4, '0')} del Colegio Agora. Necesito contar una situacion de convivencia escolar para que pueda ser revisada con discrecion por el personal responsable.`,
    consent_accepted: true,
  }));
}

function readCases() {
  if (!existsSync(casesPath)) {
    console.warn(
      `No se encontro ${casesPath}. Se usara una carga generada de respaldo.`,
    );
    return fallbackCases(requestedTotal);
  }

  const parsed = JSON.parse(readFileSync(casesPath, 'utf8'));
  if (!Array.isArray(parsed)) {
    throw new Error('El archivo de casos debe contener un arreglo JSON.');
  }

  return parsed.slice(0, requestedTotal);
}

function validateCase(rawCase, index) {
  if (!rawCase || typeof rawCase !== 'object' || Array.isArray(rawCase)) {
    throw new Error(`Caso ${index + 1}: debe ser un objeto JSON.`);
  }

  const emotionalForm = rawCase.emotional_form;
  if (
    !emotionalForm ||
    typeof emotionalForm !== 'object' ||
    Array.isArray(emotionalForm)
  ) {
    throw new Error(`Caso ${index + 1}: emotional_form es obligatorio.`);
  }

  const normalizedEmotionForm = {};
  for (const key of requiredEmotionKeys) {
    if (typeof emotionalForm[key] !== 'boolean') {
      throw new Error(
        `Caso ${index + 1}: emotional_form.${key} debe ser booleano.`,
      );
    }
    normalizedEmotionForm[key] = emotionalForm[key];
  }

  const messageText =
    typeof rawCase.message_text === 'string' ? rawCase.message_text.trim() : '';
  if (messageText.length < 30) {
    throw new Error(
      `Caso ${index + 1}: message_text debe tener al menos 30 caracteres.`,
    );
  }
  if (messageText.length > 500) {
    throw new Error(
      `Caso ${index + 1}: message_text no puede superar 500 caracteres.`,
    );
  }
  if (rawCase.consent_accepted !== true) {
    throw new Error(`Caso ${index + 1}: consent_accepted debe ser true.`);
  }

  return {
    id: `rep_massivo_${String(index + 1).padStart(6, '0')}`,
    publicCode: publicCode(index),
    emotionalForm: normalizedEmotionForm,
    messageText,
    status: pick(index * 19, statuses),
    createdAt: seededCreatedAt(index),
  };
}

function increment(map, key) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

async function main() {
  const cases = readCases();
  const reports = cases.map(validateCase);
  const total = reports.length;

  if (total === 0) {
    throw new Error('No hay casos para cargar.');
  }

  await ensureDatabaseExists(databaseConfig);
  await client.connect();
  await applySchema(client);
  console.log(`Insertando ${total} reportes anonimos desde ${casesPath}...`);

  const emotionDistribution = new Map();
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
            $1, $2, $3::jsonb, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
          )
        `,
        [
          report.id,
          report.publicCode,
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
          report.createdAt,
        ],
      );

      for (const key of requiredEmotionKeys) {
        if (report.emotionalForm[key]) increment(emotionDistribution, key);
      }
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
    console.log(
      `  Emociones marcadas: ${JSON.stringify(Object.fromEntries(emotionDistribution))}`,
    );

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }

  await client.end();
  console.log(
    'Carga masiva finalizada. La IA se ejecutara al abrir el detalle de cada reporte.',
  );
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
