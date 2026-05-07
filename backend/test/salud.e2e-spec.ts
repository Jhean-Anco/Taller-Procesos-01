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

  afterEach(async () => {
    await app.close();
  });
});
