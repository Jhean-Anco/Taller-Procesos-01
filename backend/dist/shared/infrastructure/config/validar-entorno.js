"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarEntorno = validarEntorno;
const puertoPorDefecto = '5432';
const nombreServicioPorDefecto = 'backend';
const jwtExpiracionPorDefecto = '8h';
function validarEntorno(config) {
    const errores = [];
    const esProduccion = config.NODE_ENV === 'production';
    const entornoValidado = {
        NODE_ENV: config.NODE_ENV ?? 'development',
        PORT: config.PORT ?? '3000',
        APP_NAME: config.APP_NAME ?? nombreServicioPorDefecto,
        DATABASE_ENABLED: config.DATABASE_ENABLED ?? 'false',
        DATABASE_HOST: config.DATABASE_HOST ?? 'localhost',
        DATABASE_PORT: config.DATABASE_PORT ?? puertoPorDefecto,
        DATABASE_USERNAME: config.DATABASE_USERNAME ?? 'postgres',
        DATABASE_PASSWORD: config.DATABASE_PASSWORD ?? 'postgres',
        DATABASE_NAME: config.DATABASE_NAME ?? 'safeschool_ai',
        DATABASE_SYNC: config.DATABASE_SYNC ?? 'true',
        DATABASE_SSL: config.DATABASE_SSL ?? 'false',
        JWT_SECRET: config.JWT_SECRET ??
            (esProduccion ? undefined : 'dev_jwt_secret_change_me'),
        JWT_EXPIRES_IN: config.JWT_EXPIRES_IN ?? jwtExpiracionPorDefecto,
        SESSION_SECRET: config.SESSION_SECRET ??
            (esProduccion ? undefined : 'dev_session_secret_change_me'),
        CORS_ORIGINS: config.CORS_ORIGINS ?? 'http://localhost:5173,http://127.0.0.1:5173',
        AI_SERVICE_URL: config.AI_SERVICE_URL ?? 'http://127.0.0.1:8000/analyze',
        AI_SERVICE_TIMEOUT_MS: config.AI_SERVICE_TIMEOUT_MS ?? '7000',
        AI_SERVICE_REQUIRED: config.AI_SERVICE_REQUIRED ?? 'false',
        PUBLIC_REPORT_RATE_LIMIT_WINDOW_MS: config.PUBLIC_REPORT_RATE_LIMIT_WINDOW_MS ?? '60000',
        PUBLIC_REPORT_RATE_LIMIT_MAX: config.PUBLIC_REPORT_RATE_LIMIT_MAX ?? '10',
        REPORT_AI_QUEUE_CONCURRENCY: config.REPORT_AI_QUEUE_CONCURRENCY ?? '2',
    };
    if (!entornoValidado.JWT_SECRET) {
        errores.push('JWT_SECRET es obligatoria');
    }
    if (!entornoValidado.SESSION_SECRET) {
        errores.push('SESSION_SECRET es obligatoria');
    }
    if (Number.isNaN(Number(entornoValidado.DATABASE_PORT))) {
        errores.push('DATABASE_PORT debe ser numerico');
    }
    if (Number.isNaN(Number(entornoValidado.AI_SERVICE_TIMEOUT_MS))) {
        errores.push('AI_SERVICE_TIMEOUT_MS debe ser numerico');
    }
    if (Number.isNaN(Number(entornoValidado.REPORT_AI_QUEUE_CONCURRENCY))) {
        errores.push('REPORT_AI_QUEUE_CONCURRENCY debe ser numerico');
    }
    if (errores.length > 0) {
        throw new Error(`Variables de entorno invalidas: ${errores.join(', ')}`);
    }
    return entornoValidado;
}
//# sourceMappingURL=validar-entorno.js.map