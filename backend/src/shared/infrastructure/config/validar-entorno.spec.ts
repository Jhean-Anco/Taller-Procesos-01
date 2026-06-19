import { validarEntorno } from './validar-entorno';

describe('validarEntorno', () => {
  const base = {
    NODE_ENV: 'production',
    JWT_SECRET: 'x'.repeat(32),
    SESSION_SECRET: 'y'.repeat(32),
    DATABASE_HOST: 'localhost',
    DATABASE_PORT: '5432',
    DATABASE_USERNAME: 'postgres',
    DATABASE_PASSWORD: 'postgres',
    DATABASE_NAME: 'safeschool_ai',
    AI_INTERNAL_API_KEY: 'z'.repeat(32),
    REPORTS_DATA_KEY: Buffer.alloc(32, 1).toString('base64'),
    SWAGGER_ENABLED: 'false',
    DATABASE_ENABLED: 'true',
    DATABASE_SYNC: 'false',
    DATABASE_SSL: 'false',
  };

  it('acepta configuracion de produccion valida', () => {
    const env = validarEntorno(base);
    expect(env.AI_INTERNAL_API_KEY).toBeDefined();
  });

  it('rechaza API key ausente', () => {
    expect(() => validarEntorno({ ...base, AI_INTERNAL_API_KEY: undefined })).toThrow();
  });

  it('rechaza clave de cifrado ausente', () => {
    expect(() => validarEntorno({ ...base, REPORTS_DATA_KEY: undefined })).toThrow();
  });

  it('rechaza clave de cifrado invalida', () => {
    expect(() => validarEntorno({ ...base, REPORTS_DATA_KEY: 'abc' })).toThrow();
  });

  it('rechaza secretos cortos', () => {
    expect(() => validarEntorno({ ...base, JWT_SECRET: 'short' })).toThrow();
  });

  it('rechaza swagger en produccion', () => {
    expect(() => validarEntorno({ ...base, SWAGGER_ENABLED: 'true' })).toThrow();
  });

  it('rechaza base de datos deshabilitada en produccion', () => {
    expect(() => validarEntorno({ ...base, DATABASE_ENABLED: 'false' })).toThrow();
  });
});
