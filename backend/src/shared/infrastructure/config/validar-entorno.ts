type EntornoPlano = Record<string, string | undefined>;

const puertoPorDefecto = '5432';
const nombreServicioPorDefecto = 'backend';
const jwtExpiracionPorDefecto = '8h';
const entornosPermitidos = new Set([
  'development',
  'test',
  'production',
  'demo',
]);
const valorBooleanoValido = new Set(['true', 'false']);

export function validarEntorno(config: EntornoPlano): EntornoPlano {
  const errores: string[] = [];
  const nodeEnv = config.NODE_ENV ?? 'development';
  const esProduccion = nodeEnv === 'production';
  const esTest = nodeEnv === 'test';

  const entornoValidado: EntornoPlano = {
    NODE_ENV: nodeEnv,
    PORT: config.PORT ?? '3000',
    APP_NAME: config.APP_NAME ?? nombreServicioPorDefecto,
    DATABASE_ENABLED:
      config.DATABASE_ENABLED ??
      (esTest || nodeEnv === 'demo' ? 'false' : 'true'),
    DATABASE_HOST: config.DATABASE_HOST,
    DATABASE_PORT: config.DATABASE_PORT,
    DATABASE_USERNAME: config.DATABASE_USERNAME,
    DATABASE_PASSWORD: config.DATABASE_PASSWORD,
    DATABASE_NAME: config.DATABASE_NAME,
    DATABASE_SYNC: config.DATABASE_SYNC ?? 'false',
    DATABASE_SSL: config.DATABASE_SSL ?? 'false',
    JWT_SECRET: config.JWT_SECRET,
    JWT_EXPIRES_IN: config.JWT_EXPIRES_IN ?? jwtExpiracionPorDefecto,
    SESSION_SECRET: config.SESSION_SECRET,
    CORS_ORIGINS:
      config.CORS_ORIGINS ?? 'http://localhost:5173,http://127.0.0.1:5173',
    AI_SERVICE_URL: config.AI_SERVICE_URL ?? 'http://127.0.0.1:8000/analyze',
    AI_SERVICE_TIMEOUT_MS: config.AI_SERVICE_TIMEOUT_MS ?? '7000',
    AI_SERVICE_REQUIRED: config.AI_SERVICE_REQUIRED ?? 'false',
    AI_EXTERNAL_ALLOWED: config.AI_EXTERNAL_ALLOWED ?? 'false',
    GEMINI_ENABLED: config.GEMINI_ENABLED ?? 'false',
    SWAGGER_ENABLED:
      config.SWAGGER_ENABLED ?? (esProduccion ? 'false' : 'true'),
    EXTERNAL_AI_CONSENT_REQUIRED: config.EXTERNAL_AI_CONSENT_REQUIRED ?? 'true',
    PUBLIC_REPORT_RATE_LIMIT_WINDOW_MS:
      config.PUBLIC_REPORT_RATE_LIMIT_WINDOW_MS ?? '60000',
    PUBLIC_REPORT_RATE_LIMIT_MAX: config.PUBLIC_REPORT_RATE_LIMIT_MAX ?? '10',
    REPORT_AI_QUEUE_CONCURRENCY: config.REPORT_AI_QUEUE_CONCURRENCY ?? '2',
    REPORT_AI_QUEUE_TICK_MS: config.REPORT_AI_QUEUE_TICK_MS ?? '500',
    REPORT_AI_QUEUE_MAX_RETRIES: config.REPORT_AI_QUEUE_MAX_RETRIES ?? '10',
    ANONYMITY_MIN_GROUP_SIZE: config.ANONYMITY_MIN_GROUP_SIZE ?? '3',
    REPORTS_DATA_KEY: config.REPORTS_DATA_KEY,
    REPORTS_DATA_KEY_ID: config.REPORTS_DATA_KEY_ID,
  };

  if (!entornosPermitidos.has(entornoValidado.NODE_ENV ?? '')) {
    errores.push('NODE_ENV debe ser development, test, production o demo');
  }

  if (!entornoValidado.JWT_SECRET && !esTest) {
    errores.push('JWT_SECRET es obligatoria');
  }

  if (!entornoValidado.SESSION_SECRET && !esTest) {
    errores.push('SESSION_SECRET es obligatoria');
  }

  if (
    !entornoValidado.DATABASE_HOST &&
    !esTest &&
    entornoValidado.NODE_ENV !== 'demo'
  ) {
    errores.push('DATABASE_HOST es obligatoria');
  }

  if (
    !entornoValidado.DATABASE_PORT &&
    !esTest &&
    entornoValidado.NODE_ENV !== 'demo'
  ) {
    errores.push('DATABASE_PORT es obligatoria');
  }

  if (
    !entornoValidado.DATABASE_USERNAME &&
    !esTest &&
    entornoValidado.NODE_ENV !== 'demo'
  ) {
    errores.push('DATABASE_USERNAME es obligatoria');
  }

  if (
    !entornoValidado.DATABASE_PASSWORD &&
    !esTest &&
    entornoValidado.NODE_ENV !== 'demo'
  ) {
    errores.push('DATABASE_PASSWORD es obligatoria');
  }

  if (
    !entornoValidado.DATABASE_NAME &&
    !esTest &&
    entornoValidado.NODE_ENV !== 'demo'
  ) {
    errores.push('DATABASE_NAME es obligatoria');
  }

  if (!esTest && Number.isNaN(Number(entornoValidado.DATABASE_PORT))) {
    errores.push('DATABASE_PORT debe ser numerico');
  }

  if (Number.isNaN(Number(entornoValidado.AI_SERVICE_TIMEOUT_MS))) {
    errores.push('AI_SERVICE_TIMEOUT_MS debe ser numerico');
  }

  if (Number.isNaN(Number(entornoValidado.REPORT_AI_QUEUE_CONCURRENCY))) {
    errores.push('REPORT_AI_QUEUE_CONCURRENCY debe ser numerico');
  }

  if (
    !valorBooleanoValido.has(
      (entornoValidado.DATABASE_ENABLED ?? '').toLowerCase(),
    )
  ) {
    errores.push('DATABASE_ENABLED debe ser true o false');
  }

  if (
    !valorBooleanoValido.has(
      (entornoValidado.DATABASE_SYNC ?? '').toLowerCase(),
    )
  ) {
    errores.push('DATABASE_SYNC debe ser true o false');
  }

  if (
    !valorBooleanoValido.has((entornoValidado.DATABASE_SSL ?? '').toLowerCase())
  ) {
    errores.push('DATABASE_SSL debe ser true o false');
  }

  if (
    !valorBooleanoValido.has(
      (entornoValidado.GEMINI_ENABLED ?? '').toLowerCase(),
    )
  ) {
    errores.push('GEMINI_ENABLED debe ser true o false');
  }

  if (
    !valorBooleanoValido.has(
      (entornoValidado.AI_EXTERNAL_ALLOWED ?? '').toLowerCase(),
    )
  ) {
    errores.push('AI_EXTERNAL_ALLOWED debe ser true o false');
  }

  if (
    !valorBooleanoValido.has(
      (entornoValidado.EXTERNAL_AI_CONSENT_REQUIRED ?? '').toLowerCase(),
    )
  ) {
    errores.push('EXTERNAL_AI_CONSENT_REQUIRED debe ser true o false');
  }

  if (esProduccion) {
    const jwtSecret = entornoValidado.JWT_SECRET ?? '';
    const sessionSecret = entornoValidado.SESSION_SECRET ?? '';
    if ((entornoValidado.DATABASE_ENABLED ?? 'false') !== 'true') {
      errores.push('DATABASE_ENABLED debe ser true en production');
    }
    if ((entornoValidado.DATABASE_SYNC ?? 'true') !== 'false') {
      errores.push('DATABASE_SYNC debe ser false en production');
    }
    if (jwtSecret.length < 32) {
      errores.push(
        'JWT_SECRET debe tener al menos 32 caracteres en production',
      );
    }
    if (sessionSecret.length < 32) {
      errores.push(
        'SESSION_SECRET debe tener al menos 32 caracteres en production',
      );
    }
    if ((entornoValidado.SWAGGER_ENABLED ?? 'true') !== 'false') {
      errores.push('SWAGGER_ENABLED debe ser false en production');
    }
    if ((entornoValidado.AI_EXTERNAL_ALLOWED ?? 'true') !== 'false') {
      errores.push('AI_EXTERNAL_ALLOWED debe ser false en production');
    }
    if ((entornoValidado.GEMINI_ENABLED ?? 'true') !== 'false') {
      errores.push('GEMINI_ENABLED debe ser false en production');
    }
    if (!entornoValidado.AI_INTERNAL_API_KEY) {
      errores.push('AI_INTERNAL_API_KEY es obligatoria en production');
    }
    if (!entornoValidado.REPORTS_DATA_KEY) {
      errores.push('REPORTS_DATA_KEY es obligatoria en production');
    }
  }

  if (errores.length > 0) {
    throw new Error(`Variables de entorno invalidas: ${errores.join(', ')}`);
  }

  return entornoValidado;
}
