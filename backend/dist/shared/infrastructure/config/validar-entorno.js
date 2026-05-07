"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarEntorno = validarEntorno;
const puertoPorDefecto = '5432';
const nombreServicioPorDefecto = 'backend';
const modeloIaPorDefecto = 'gpt-4.1-mini';
const urlIaPorDefecto = 'https://api.openai.com/v1/chat/completions';
const jwtExpiracionPorDefecto = '8h';
function validarEntorno(config) {
    const errores = [];
    const entornoValidado = {
        PORT: config.PORT ?? '3000',
        APP_NAME: config.APP_NAME ?? nombreServicioPorDefecto,
        DATABASE_ENABLED: config.DATABASE_ENABLED ?? 'false',
        DATABASE_HOST: config.DATABASE_HOST ?? 'localhost',
        DATABASE_PORT: config.DATABASE_PORT ?? puertoPorDefecto,
        DATABASE_USERNAME: config.DATABASE_USERNAME ?? 'postgres',
        DATABASE_PASSWORD: config.DATABASE_PASSWORD ?? 'postgres',
        DATABASE_NAME: config.DATABASE_NAME ?? 'app_db',
        DATABASE_SYNC: config.DATABASE_SYNC ?? 'true',
        DATABASE_SSL: config.DATABASE_SSL ?? 'false',
        JWT_SECRET: config.JWT_SECRET,
        JWT_EXPIRES_IN: config.JWT_EXPIRES_IN ?? jwtExpiracionPorDefecto,
        SESSION_SECRET: config.SESSION_SECRET,
        IA_API_URL: config.IA_API_URL ?? urlIaPorDefecto,
        IA_API_MODEL: config.IA_API_MODEL ?? modeloIaPorDefecto,
        IA_API_KEY: config.IA_API_KEY,
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
    if (errores.length > 0) {
        throw new Error(`Variables de entorno invalidas: ${errores.join(', ')}`);
    }
    return entornoValidado;
}
//# sourceMappingURL=validar-entorno.js.map