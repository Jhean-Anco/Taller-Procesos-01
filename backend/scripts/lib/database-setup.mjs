import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcrypt';
import { Client } from 'pg';

const scriptsRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const backendRoot = dirname(scriptsRoot);
const defaultMigrationsDir = join(backendRoot, 'migrations');

export function readEnvFile(filePath) {
  try {
    const raw = readFileSync(filePath, 'utf8');
    return Object.fromEntries(
      raw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#') && line.includes('='))
        .map((line) => {
          const index = line.indexOf('=');
          const key = line.slice(0, index).trim();
          const value = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, '');
          return [key, value];
        }),
    );
  } catch {
    return {};
  }
}

export function resolveDatabaseConfig(env) {
  return {
    host: env.DATABASE_HOST ?? env.BASE_DATOS_HOST ?? 'localhost',
    port: Number(env.DATABASE_PORT ?? env.BASE_DATOS_PUERTO ?? 5432),
    user: env.DATABASE_USERNAME ?? env.BASE_DATOS_USUARIO ?? 'postgres',
    password: env.DATABASE_PASSWORD ?? env.BASE_DATOS_CLAVE ?? 'postgres',
    database: env.DATABASE_NAME ?? env.BASE_DATOS_NOMBRE ?? 'safeschool_ai',
    ssl:
      (env.DATABASE_SSL ?? env.BASE_DATOS_SSL ?? 'false') === 'true'
        ? { rejectUnauthorized: false }
        : false,
  };
}

function quoteIdentifier(identifier) {
  return `"${identifier.replace(/"/g, '""')}"`;
}

export async function ensureDatabaseExists(config) {
  const maintenanceDatabase =
    config.database === 'postgres' ? 'template1' : 'postgres';
  const client = new Client({
    ...config,
    database: maintenanceDatabase,
  });

  await client.connect();
  try {
    const { rowCount } = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [config.database],
    );

    if (rowCount === 0) {
      await client.query(`CREATE DATABASE ${quoteIdentifier(config.database)}`);
      console.log(`Base de datos creada: ${config.database}`);
    }
  } finally {
    await client.end().catch(() => {});
  }
}

export async function applySchema(client, migrationsDir = defaultMigrationsDir) {
  const migrations = readdirSync(migrationsDir)
    .filter((file) => /^\d+_.*\.sql$/i.test(file) && !file.endsWith('.rollback.sql'))
    .sort((a, b) => a.localeCompare(b));

  for (const migration of migrations) {
    const sql = readFileSync(join(migrationsDir, migration), 'utf8');
    await client.query(sql);
  }
}

export async function seedBootstrapUsers(client, env) {
  const users = [
    {
      id: 'usr_bootstrap_admin_local',
      name: env.BOOTSTRAP_ADMIN_NAME ?? 'Administrador Local',
      email: env.BOOTSTRAP_ADMIN_EMAIL,
      password: env.BOOTSTRAP_ADMIN_PASSWORD,
      role: 'ADMIN_DIRECTOR',
    },
    {
      id: 'usr_bootstrap_psychologist_local',
      name: env.BOOTSTRAP_PSYCHOLOGIST_NAME ?? 'Psicologia Local',
      email: env.BOOTSTRAP_PSYCHOLOGIST_EMAIL,
      password: env.BOOTSTRAP_PSYCHOLOGIST_PASSWORD,
      role: 'PSYCHOLOGIST',
    },
  ].filter((user) => user.email && user.password);

  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    await client.query(
      `
        INSERT INTO users (id, name, email, password_hash, role, active, token_version, created_at, updated_at)
        VALUES ($1, $2, lower($3), $4, $5, true, 0, now(), now())
        ON CONFLICT (email) DO UPDATE
        SET name = EXCLUDED.name,
            password_hash = EXCLUDED.password_hash,
            role = EXCLUDED.role,
            active = true,
            updated_at = now();
      `,
      [user.id, user.name, user.email, passwordHash, user.role],
    );
  }
}
