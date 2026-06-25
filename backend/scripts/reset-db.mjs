import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { Client } from 'pg';
import {
  applySchema,
  ensureDatabaseExists,
  readEnvFile,
  resolveDatabaseConfig,
  seedBootstrapUsers,
} from './lib/database-setup.mjs';

const args = new Set(process.argv.slice(2));
const migrateOnly = args.has('--migrate-only');
const resetDev = args.has('--reset-dev');
const confirm = args.has('--confirm');

const envFile = join(process.cwd(), '.env');
const fileEnv = readEnvFile(envFile);
const env = { ...fileEnv, ...process.env };
const databaseConfig = resolveDatabaseConfig(env);

if (migrateOnly) {
  await ensureDatabaseExists(databaseConfig);
  const client = new Client(databaseConfig);
  try {
    await client.connect();
    await applySchema(client);
    await seedBootstrapUsers(client, env);
    console.log('Migraciones aplicadas.');
  } finally {
    await client.end().catch(() => {});
  }
  process.exit(0);
}

if (!resetDev) {
  console.error('Uso: node backend/scripts/reset-db.mjs --reset-dev --confirm');
  process.exit(1);
}

if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
  console.error('NODE_ENV debe ser development o test para borrar datos.');
  process.exit(1);
}

if (process.env.ALLOW_DESTRUCTIVE_DB_RESET !== 'true') {
  console.error('ALLOW_DESTRUCTIVE_DB_RESET=true es obligatorio.');
  process.exit(1);
}

const targetName = String(databaseConfig.database ?? '');
if (!/(_dev|_test|test|dev)/i.test(targetName)) {
  console.error(`Base objetivo rechazada por nombre inseguro: ${targetName}`);
  process.exit(1);
}

console.log(
  `Destino: ${databaseConfig.host}:${databaseConfig.port}/${targetName}`,
);

if (!confirm) {
  console.error('Confirmacion requerida: agrega --confirm para continuar.');
  process.exit(1);
}

await ensureDatabaseExists(databaseConfig);
const client = new Client(databaseConfig);
try {
  await client.connect();
  await applySchema(client);
  const { rows } = await client.query(`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename NOT IN ('migrations', 'typeorm_metadata')
    ORDER BY tablename;
  `);
  const tables = rows.map((row) => row.tablename);
  if (tables.length === 0) {
    console.log('No hay tablas para vaciar.');
  } else {
    const quoted = tables.map((table) => `"public"."${table.replace(/"/g, '""')}"`).join(', ');
    await client.query(`TRUNCATE TABLE ${quoted} RESTART IDENTITY CASCADE;`);
    console.log(`Base vaciada. Tablas reiniciadas: ${tables.length}.`);
  }
  await applySchema(client);
  await seedBootstrapUsers(client, env);
} finally {
  await client.end().catch(() => {});
}
