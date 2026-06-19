import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AplicacionModule } from './../src/aplicacion.module';
import { configurarAplicacion } from './../src/configurar-aplicacion';
import { Rol } from './../src/shared/domain/enums/rol.enum';

interface RespuestaLoginE2E {
  ok: boolean;
  data: {
    accessToken: string;
    usuario: {
      id: string;
      nombre: string;
      correo: string;
      rol: Rol;
    };
  };
  meta: {
    path: string;
    timestamp: string;
  };
}

interface RespuestaSesionE2E {
  ok: boolean;
  data: {
    usuario: {
      id: string;
      nombre: string;
      correo: string;
      rol: Rol;
    };
  };
  meta: {
    path: string;
    timestamp: string;
  };
}

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    process.env.BOOTSTRAP_ADMIN_EMAIL = 'admin@test.local';
    process.env.BOOTSTRAP_ADMIN_PASSWORD = 'test-bootstrap-password';
    process.env.BOOTSTRAP_PSYCHOLOGIST_EMAIL = 'psicologo@test.local';
    process.env.BOOTSTRAP_PSYCHOLOGIST_PASSWORD = 'test-bootstrap-password';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AplicacionModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configurarAplicacion(app);
    await app.init();
  });

  it('mantiene la sesion del usuario autenticado y permite cerrar sesion', async () => {
    const agente = request.agent(app.getHttpServer());

    const respuestaLogin = await agente
      .post('/api/v1/auth/login')
      .send({
        correo: 'psicologo@test.local',
        password: 'test-bootstrap-password',
      })
      .expect(201);

    const bodyLogin = respuestaLogin.body as RespuestaLoginE2E;

    expect(bodyLogin.ok).toBe(true);
    expect(typeof bodyLogin.data.accessToken).toBe('string');
    expect(bodyLogin.data.accessToken.length).toBeGreaterThan(20);
    expect(bodyLogin.data.usuario).toMatchObject({
      correo: 'psicologo@test.local',
      rol: 'PSYCHOLOGIST',
    });
    expect(bodyLogin.meta.path).toBe('/api/v1/auth/login');

    const respuestaSesion = await agente.get('/api/v1/auth/sesion').expect(200);
    const bodySesion = respuestaSesion.body as RespuestaSesionE2E;

    expect(bodySesion.ok).toBe(true);
    expect(bodySesion.data.usuario).toMatchObject({
      correo: 'psicologo@test.local',
      rol: 'PSYCHOLOGIST',
    });
    expect(bodySesion.meta.path).toBe('/api/v1/auth/sesion');

    const respuestaLogout = await agente
      .post('/api/v1/auth/logout')
      .expect(201);

    expect(respuestaLogout.body).toMatchObject({
      ok: true,
      data: {
        ok: true,
      },
      meta: {
        path: '/api/v1/auth/logout',
      },
    });

    await agente.get('/api/v1/auth/sesion').expect(401);
  });

  afterEach(async () => {
    await app.close();
  });
});
