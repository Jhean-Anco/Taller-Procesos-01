import { join } from 'node:path';
import { Client } from 'pg';
import {
  applySchema,
  ensureDatabaseExists,
  readEnvFile,
  resolveDatabaseConfig,
} from './lib/database-setup.mjs';

const envFile = join(process.cwd(), '.env');
const fileEnv = readEnvFile(envFile);
const env = { ...fileEnv, ...process.env };
const databaseConfig = resolveDatabaseConfig(env);

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
    console.log(`Base de datos vaciada. Tablas reiniciadas: ${tables.length}.`);
  }

  await applySchema(client);
} finally {
  await client.end().catch(() => {});
}
