import { spawn } from 'node:child_process';
import { openSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import net from 'node:net';

const raiz = process.cwd();
const runtime = join(raiz, '.runtime');
mkdirSync(runtime, { recursive: true });
const npmBin = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function setDefaultEnv(name, value) {
  if (!process.env[name]) process.env[name] = value;
}

setDefaultEnv('DATABASE_ENABLED', 'true');
setDefaultEnv('NODE_ENV', 'development');
setDefaultEnv('JWT_SECRET', 'dev_jwt_secret_safeschool_ai_local_32_chars_min');
setDefaultEnv('SESSION_SECRET', 'dev_session_secret_safeschool_ai_local_32_chars_min');
setDefaultEnv('BOOTSTRAP_ADMIN_EMAIL', 'admin@safeschool.test');
setDefaultEnv('BOOTSTRAP_ADMIN_PASSWORD', 'admin-local-password');
setDefaultEnv('BOOTSTRAP_PSYCHOLOGIST_EMAIL', 'psicologo@safeschool.test');
setDefaultEnv('BOOTSTRAP_PSYCHOLOGIST_PASSWORD', 'psicologo-local-password');
setDefaultEnv('DATABASE_HOST', 'localhost');
setDefaultEnv('DATABASE_PORT', '5432');
setDefaultEnv('DATABASE_USERNAME', 'postgres');
setDefaultEnv('DATABASE_PASSWORD', 'postgres');
setDefaultEnv('DATABASE_NAME', 'safeschool_ai');
setDefaultEnv('DATABASE_SYNC', 'false');
setDefaultEnv('DATABASE_SSL', 'false');

function portInUse(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(700);
    socket.on('connect', () => { socket.destroy(); resolve(true); });
    socket.on('timeout', () => { socket.destroy(); resolve(false); });
    socket.on('error', () => resolve(false));
    socket.connect(port, '127.0.0.1');
  });
}

function run(command, args, options = {}) {
  const child = spawn(command, args, { stdio: 'inherit', shell: false, ...options });
  return new Promise((resolve, reject) => {
    child.on('error', reject);
    child.on('exit', (code) => (code === 0 ? resolve(child.pid) : reject(new Error(`Exit ${code}`))));
  });
}

async function startIfMissing(name, port, command, args, options = {}) {
  try {
    if (await portInUse(port)) {
      console.log(`${name} ya esta activo en http://127.0.0.1:${port}`);
      return;
    }
  } catch {}

  const pidFile = join(runtime, `${name}.pid`);
  const outPath = join(runtime, `${name}.log`);
  const errPath = join(runtime, `${name}.error.log`);
  const stdio = options.stdio ?? [
    'ignore',
    openSync(outPath, 'a'),
    openSync(errPath, 'a'),
  ];
  const isWindows = process.platform === 'win32';
  const child = spawn(command, args, {
    cwd: raiz,
    shell: isWindows,
    detached: true,
    stdio,
  });
  writeFileSync(pidFile, String(child.pid));
  child.unref();
  console.log(`Iniciando ${name}...`);
}

async function main() {
  await startIfMissing('ia', 8000, 'node', ['scripts/servicio-ia.mjs']);
  console.log('Ejecutando migraciones de la BD antes de iniciar backend...');
  await run('node', ['backend/scripts/reset-db.mjs', '--migrate-only']);
  await startIfMissing('backend', 3000, npmBin, ['--prefix', 'backend', 'run', 'dev']);
  await startIfMissing('frontend', 5173, npmBin, ['--prefix', 'frontend', 'run', 'dev', '--', '--host', '127.0.0.1', '--port', '5173']);
  console.log('Sistema listo:');
  console.log('  Frontend: http://127.0.0.1:5173');
  console.log('  Backend : http://127.0.0.1:3000');
  console.log('  IA      : http://127.0.0.1:8000');
  console.log(`Logs: ${runtime}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
