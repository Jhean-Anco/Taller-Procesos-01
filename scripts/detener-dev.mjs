import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const raiz = process.cwd();
const runtime = join(raiz, '.runtime');

function stopPid(pid) {
  try {
    if (process.platform === 'win32') {
      execFileSync('taskkill', ['/PID', String(pid), '/F'], { stdio: 'ignore' });
    } else {
      execFileSync('kill', ['-9', String(pid)], { stdio: 'ignore' });
    }
  } catch {}
}

if (existsSync(runtime)) {
  for (const entry of (await import('node:fs')).readdirSync(runtime, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.pid')) continue;
    const pidFile = join(runtime, entry.name);
    const pid = Number(String(readFileSync(pidFile, 'utf8')).trim());
    if (Number.isFinite(pid)) stopPid(pid);
    rmSync(pidFile, { force: true });
  }
}

console.log('Servicios de desarrollo detenidos.');
