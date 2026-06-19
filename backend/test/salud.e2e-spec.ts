import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AplicacionModule } from './../src/aplicacion.module';
import { configurarAplicacion } from './../src/configurar-aplicacion';

interface RespuestaSaludE2E {
  ok: boolean;
  data: {
    status: string;
    service: string;
  };
  meta: {
    path: string;
    timestamp: string;
  };
}

describe('Salud (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AplicacionModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configurarAplicacion(app);
    await app.init();
  });

  it('/api/v1/salud (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/salud')
      .expect(200)
      .expect((response) => {
        const body = response.body as RespuestaSaludE2E;

        expect(body.ok).toBe(true);
        expect(body.data).toEqual({
          status: 'ok',
          service: 'backend',
        });
        expect(body.meta.path).toBe('/api/v1/salud');
        expect(typeof body.meta.timestamp).toBe('string');
      });
  });

  it('/api/v1/salud/db (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/salud/db')
      .expect(200)
      .expect((response) => {
        const body = response.body as RespuestaSaludE2E;

        expect(body.ok).toBe(true);
        expect(['postgres', 'database-disabled']).toContain(body.data.service);
        expect(['ok', 'unavailable']).toContain(body.data.status);
        expect(body.meta.path).toBe('/api/v1/salud/db');
      });
  });

  it('/api/v1/salud/ai (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/salud/ai')
      .expect(200)
      .expect((response) => {
        const body = response.body as RespuestaSaludE2E;

        expect(body.ok).toBe(true);
        expect(body.data.status).toMatch(/configured|required/);
        expect(typeof body.data.service).toBe('string');
        expect(body.meta.path).toBe('/api/v1/salud/ai');
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
