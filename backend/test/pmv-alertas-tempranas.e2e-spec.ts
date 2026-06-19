import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AplicacionModule } from './../src/aplicacion.module';
import { configurarAplicacion } from './../src/configurar-aplicacion';

interface ApiResponse<T> {
  ok: boolean;
  data: T;
}

describe('PMV alertas tempranas (e2e)', () => {
  let app: INestApplication<App>;
  const aiServiceUrlOriginal = process.env.AI_SERVICE_URL;
  const aiServiceRequiredOriginal = process.env.AI_SERVICE_REQUIRED;

  beforeEach(async () => {
    process.env.BOOTSTRAP_ADMIN_EMAIL = 'admin@test.local';
    process.env.BOOTSTRAP_ADMIN_PASSWORD = 'test-bootstrap-password';
    process.env.BOOTSTRAP_PSYCHOLOGIST_EMAIL = 'psicologo@test.local';
    process.env.BOOTSTRAP_PSYCHOLOGIST_PASSWORD = 'test-bootstrap-password';
    process.env.AI_SERVICE_URL = 'http://127.0.0.1:1/analyze';
    process.env.AI_SERVICE_REQUIRED = 'false';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AplicacionModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configurarAplicacion(app);
    await app.init();
  });

  it('crea reporte anónimo, lo revisa y expone dashboard agregado', async () => {
    const reportResponse = await request(app.getHttpServer())
      .post('/api/v1/anonymous-reports')
      .send({
        grade_reference: 'secundaria-3',
        section_reference: 'B',
        age_range: '12-14',
        emotional_form: {
          fear: true,
          anxiety: true,
          isolation: true,
        },
        message_text:
          'Tengo miedo porque se burlan de mi y me siento solo durante los recreos.',
        consent_accepted: true,
      })
      .expect(201);

    expect((reportResponse.body as ApiResponse<{ public_code: string }>).data.public_code).toMatch(/^AR-/);
    expect(JSON.stringify(reportResponse.body)).not.toContain('risk_ai');

    await request(app.getHttpServer())
      .post('/api/v1/anonymous-reports')
      .send({
        grade_reference: 'secundaria-4',
        section_reference: 'A',
        age_range: '15-17',
        emotional_form: {
          sadness: true,
          school_insecurity: true,
        },
        message_text:
          'Me siento triste y prefiero no participar porque varios companeros me insultan.',
        consent_accepted: true,
      })
      .expect(201);

    const psychologistLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'psicologo@test.local', password: 'test-bootstrap-password' })
      .expect(201);
    const psychologistToken = (
      psychologistLogin.body as ApiResponse<{ accessToken: string }>
    ).data.accessToken;

    const reportsResponse = await request(app.getHttpServer())
      .get('/api/v1/psychologist/reports')
      .set('Authorization', `Bearer ${psychologistToken}`)
      .expect(200);

    const reports = (
      reportsResponse.body as ApiResponse<
        Array<{ id: string; risk_ai: string | null; priority_risk: string | null }>
      >
    ).data;
    expect(reports).toHaveLength(2);
    expect(reports.every((report) => report.risk_ai === null)).toBe(true);
    expect(reports.every((report) => report.priority_risk === null)).toBe(true);

    const detailResponse = await request(app.getHttpServer())
      .get(`/api/v1/psychologist/reports/${reports[0].id}`)
      .set('Authorization', `Bearer ${psychologistToken}`)
      .expect(200);
    expect(
      (
        detailResponse.body as ApiResponse<{
          ai_analysis: { risk_ai: string; model_version: string };
        }>
      ).data.ai_analysis,
    ).toMatchObject({
      risk_ai: 'MEDIUM',
      model_version: 'typescript-safety-fallback',
    });

    await request(app.getHttpServer())
      .post(`/api/v1/psychologist/reports/${reports[0].id}/review`)
      .set('Authorization', `Bearer ${psychologistToken}`)
      .send({ validated_risk: 'HIGH', observation_internal: 'Revision prioritaria.' })
      .expect(201);

    const alertsResponse = await request(app.getHttpServer())
      .get('/api/v1/alerts')
      .set('Authorization', `Bearer ${psychologistToken}`)
      .expect(200);
    expect(
      (alertsResponse.body as ApiResponse<Array<{ risk_level: string }>>).data.some(
        (alert) => alert.risk_level === 'HIGH',
      ),
    ).toBe(true);

    const adminLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@test.local', password: 'test-bootstrap-password' })
      .expect(201);
    const adminToken = (
      adminLogin.body as ApiResponse<{ accessToken: string }>
    ).data.accessToken;

    const createdEmail = `usuario-${Date.now()}@agora.edu.pe`;
    const createdPassword = 'Temporal123*';
    const createdUserResponse = await request(app.getHttpServer())
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Usuario Prueba',
        email: createdEmail,
        password: createdPassword,
        role: 'ADMIN_DIRECTOR',
      })
      .expect(201);
    expect(
      (
        createdUserResponse.body as ApiResponse<{
          email: string;
          role: string;
        }>
      ).data,
    ).toMatchObject({
      email: createdEmail,
      role: 'ADMIN_DIRECTOR',
    });

    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: createdEmail, password: createdPassword })
      .expect(201);

    const summaryResponse = await request(app.getHttpServer())
      .get('/api/v1/dashboard/summary')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(
      (
        summaryResponse.body as ApiResponse<{
          reports_received: number;
          alerts_generated: number;
          ai_classified_reports: number;
          ai_pending_reports: number;
        }>
      ).data,
    ).toMatchObject({
      reports_received: 2,
      alerts_generated: 1,
      ai_classified_reports: 1,
      ai_pending_reports: 1,
    });

    const adminReportsResponse = await request(app.getHttpServer())
      .get('/api/v1/dashboard/reports')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    const adminReports = (
      adminReportsResponse.body as ApiResponse<
        Array<{ id: string; ai_degraded: boolean; risk: string | null; summary: string }>
      >
    ).data;
    expect(adminReports).toHaveLength(2);
    expect(adminReports.find((report) => report.id === reports[0].id)).toMatchObject({
      ai_degraded: true,
      risk: 'HIGH',
    });
    expect(adminReports.find((report) => report.id === reports[1].id)).toMatchObject({
      ai_degraded: false,
      risk: null,
    });

    const adminReportDetailResponse = await request(app.getHttpServer())
      .get(`/api/v1/dashboard/reports/${reports[0].id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(
      adminReportDetailResponse.body as ApiResponse<{
        public_code: string;
        summary: string;
        sensitive_data: { available_only_for_psychologist: boolean };
        analysis_queue: { status: string; attempts: number };
      }>,
    ).toMatchObject({
      data: {
        public_code: expect.any(String),
        summary: expect.any(String),
        sensitive_data: {
          available_only_for_psychologist: true,
        },
        analysis_queue: {
          status: expect.any(String),
          attempts: expect.any(Number),
        },
      },
    });
  });

  afterEach(async () => {
    await app.close();
    if (aiServiceUrlOriginal === undefined) {
      delete process.env.AI_SERVICE_URL;
    } else {
      process.env.AI_SERVICE_URL = aiServiceUrlOriginal;
    }
    if (aiServiceRequiredOriginal === undefined) {
      delete process.env.AI_SERVICE_REQUIRED;
    } else {
      process.env.AI_SERVICE_REQUIRED = aiServiceRequiredOriginal;
    }
  });
});
