import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const raiz = process.cwd();
const candidatos = [
  join(raiz, '.venv', 'Scripts', 'python.exe'),
  join(raiz, 'ai-service', '.venv', 'Scripts', 'python.exe'),
  process.env.PYTHON,
  'python',
  'py',
];

function ejecutar(comando, args, opciones = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(comando, args, { stdio: 'inherit', shell: false, ...opciones });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Proceso salio con codigo ${code}`));
      }
    });
  });
}

async function main() {
  for (const candidato of candidatos) {
    if (!candidato) continue;
    if (candidato.includes('\\') && !existsSync(candidato)) continue;
    try {
      await ejecutar(candidato, ['--version']);
      await ejecutar(candidato, ['-m', 'uvicorn', 'services.app:app', '--host', '127.0.0.1', '--port', '8000'], {
        cwd: raiz,
      });
      return;
    } catch {
      continue;
    }
  }

  await ejecutar('node', ['scripts/servicio-ia-local.mjs'], { cwd: raiz });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
