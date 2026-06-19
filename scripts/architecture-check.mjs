import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const target = process.argv[2];

if (!target) {
  console.error('Uso: node scripts/architecture-check.mjs <backend|frontend|ai-service>');
  process.exit(1);
}

const rules = {
  backend: [
    {
      match: /src[\\/].*[\\/]domain[\\/].*\.(ts|tsx)$/,
      forbidden: [/from\s+['"]@nestjs\//, /from\s+['"]typeorm['"]/, /from\s+['"]express['"]/, /from\s+['"]fastapi['"]/],
    },
    {
      match: /src[\\/].*[\\/]application[\\/].*\.(ts|tsx)$/,
      forbidden: [/from\s+['"]@nestjs\//, /from\s+['"]typeorm['"]/, /from\s+['"]express['"]/, /fetch\(/, /sessionStorage/, /localStorage/],
    },
    {
      match: /src[\\/].*[\\/]infrastructure[\\/].*[\\/](domain|application)[\\/].*\.(ts|tsx)$/,
      forbidden: [],
    },
  ],
  frontend: [
    {
      match: /src[\\/].*[\\/]shared[\\/]domain[\\/].*\.(ts|tsx)$/,
      forbidden: [/from\s+['"]react['"]/, /from\s+['"]react-dom['"]/, /fetch\(/, /sessionStorage/, /localStorage/, /window\./, /document\./],
    },
    {
      match: /src[\\/].*[\\/]shared[\\/]application[\\/].*\.(ts|tsx)$/,
      forbidden: [/from\s+['"]react['"]/, /from\s+['"]react-dom['"]/, /fetch\(/, /sessionStorage/, /localStorage/, /window\./, /document\./],
    },
    {
      match: /src[\\/].*[\\/]modules[\\/].*[\\/]domain[\\/].*\.(ts|tsx)$/,
      forbidden: [/from\s+['"]react['"]/, /fetch\(/, /sessionStorage/, /localStorage/, /window\./, /document\./],
    },
  ],
  'ai-service': [
    {
      match: /src[\\/].*[\\/]analysis[\\/](domain|application)[\\/].*\.(py)$/,
      forbidden: [/from\s+fastapi\b/, /from\s+fastapi\./, /@app\./, /HTTPException/, /Request/],
    },
  ],
};

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (entry === 'dist' || entry === 'coverage' || entry === 'node_modules') {
        continue;
      }
      walk(full, files);
    } else if (/\.(ts|tsx|py)$/.test(entry) && !/\.spec\./.test(entry) && !/\.d\.ts$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

const baseDir =
  target === 'backend' ? join(root, '..', 'backend') :
  target === 'frontend' ? join(root, '..', 'frontend') :
  target === 'ai-service' ? join(root, '..', 'ai-service') :
  null;

if (!baseDir || !rules[target]) {
  console.error(`Target invalido: ${target}`);
  process.exit(1);
}

const violations = [];
for (const file of walk(baseDir)) {
  const rel = relative(join(root, '..'), file);
  const source = readFileSync(file, 'utf8');
  for (const rule of rules[target]) {
    if (rule.match.test(rel)) {
      for (const forbidden of rule.forbidden) {
        if (forbidden.test(source)) {
          violations.push(`${rel}: coincide con ${forbidden}`);
        }
      }
    }
  }
}

if (violations.length > 0) {
  console.error('Violaciones arquitectonicas encontradas:');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log(`Arquitectura validada para ${target}.`);
