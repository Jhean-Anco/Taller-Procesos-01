import {
  AlertGeneratedBy,
  DerivationStatus,
  ReportStatus,
  RiskLevel,
} from '../../../shared/domain/enums';
import { generarCodigoReporte, generarIdSeguro } from '../../../shared/domain/id-generator';
import { AlertsService } from '../../../alerts/application/use-cases/alerts.service';
import { AuditService } from '../../../audit/application/use-cases/audit.service';
import {
  AiAnalysis,
  AnonymousReport,
  Derivation,
  PsychologicalReview,
} from '../../domain/entities/report.entity';
import { ReportAggregate, REPORTS_REPOSITORY, ReportFilters, ReportsRepository } from '../../domain/repositories/reports.repository';
import { TextPrivacyService } from '../../domain/services/text-privacy.service';
import { AI_ANALYZER, AiAnalyzerPort } from '../ports/ai-analyzer.port';
import { CreateAnonymousReportDto, DeriveReportDto, ReviewReportDto } from '../dtos/report.dtos';
import { ReportPresenter } from '../presenters/report.presenter';
import { ArchivedReportError, ReportNotFoundError, ReportValidationError } from '../errors/reports.errors';

export interface InternalActor {
  id: string;
  ip?: string | null;
}

export class ReportsUseCases {
  private readonly presenter = new ReportPresenter();
  private readonly privacy = new TextPrivacyService();

  constructor(
    private readonly reportsRepository: ReportsRepository,
    private readonly aiAnalyzer: AiAnalyzerPort,
    private readonly alertsService: AlertsService,
    private readonly auditService: AuditService,
  ) {}

  async createAnonymousReport(dto: CreateAnonymousReportDto) {
    if (!dto.consent_accepted) {
      throw new ReportValidationError('Debes aceptar el aviso informativo');
    }

    const now = new Date();
    const report = await this.reportsRepository.createReport(
      new AnonymousReport({
        id: generarIdSeguro('rep'),
        publicCode: generarCodigoReporte(),
        gradeReference: dto.grade_reference ?? null,
        sectionReference: dto.section_reference ?? null,
        ageRange: dto.age_range ?? null,
        emotionalForm: dto.emotional_form,
        messageText: dto.message_text.trim(),
        consentAccepted: true,
        status: ReportStatus.PENDING,
        analysisQueueStatus: 'PENDING',
        analysisAttempts: 0,
        analysisNextAttemptAt: null,
        analysisLastError: null,
        analysisRequestedAt: now,
        createdAt: now,
        updatedAt: now,
      }),
    );

    return this.presenter.publicResponse(report.publicCode);
  }

  async getPublicStatus(publicCode: string) {
    const aggregate = await this.reportsRepository.findByPublicCode(publicCode);
    if (!aggregate) {
      throw new ReportNotFoundError();
    }
    return this.presenter.publicStatus(aggregate);
  }

  async listForPsychologist(filters?: ReportFilters) {
    const aggregates = await this.reportsRepository.list(filters);
    const total = await this.reportsRepository.count(filters);
    const sorted = aggregates
      .sort((a, b) => this.priority(b) - this.priority(a))
      .map((aggregate) => this.presenter.psychologistList(aggregate));

    return this.paginate(sorted, filters, total);
  }

  async getForPsychologist(id: string, actor: InternalActor) {
    const aggregate = await this.ensureAnalysisIfNeeded(await this.getAggregate(id));
    await this.auditService.register({
      actorUserId: actor.id,
      action: 'VIEW_REPORT',
      entityType: 'anonymous_report',
      entityId: id,
      ip: actor.ip,
    });
    return this.presenter.psychologistDetail(aggregate);
  }

  async review(id: string, dto: ReviewReportDto, actor: InternalActor) {
    await this.getAggregate(id);
    const review = await this.reportsRepository.saveReview(
      new PsychologicalReview({
        id: generarIdSeguro('rev'),
        reportId: id,
        psychologistId: actor.id,
        validatedRisk: dto.validated_risk,
        observationInternal: dto.observation_internal ?? null,
        reviewedAt: new Date(),
      }),
    );

    await this.alertsService.ensureForRisk(
      id,
      review.validatedRisk,
      AlertGeneratedBy.PSYCHOLOGIST,
    );
    await this.auditService.register({
      actorUserId: actor.id,
      action: 'VALIDATE_RISK',
      entityType: 'anonymous_report',
      entityId: id,
      metadata: { validated_risk: dto.validated_risk },
      ip: actor.ip,
    });

    return {
      report_id: id,
      validated_risk: review.validatedRisk,
      reviewed_at: review.reviewedAt.toISOString(),
    };
  }

  async changeStatus(id: string, status: ReportStatus, actor: InternalActor) {
    const aggregate = await this.getAggregate(id);
    const saved = await this.reportsRepository.saveReport(
      aggregate.report.changeStatus(status),
    );
    await this.auditService.register({
      actorUserId: actor.id,
      action: 'CHANGE_REPORT_STATUS',
      entityType: 'anonymous_report',
      entityId: id,
      metadata: { status },
      ip: actor.ip,
    });
    return this.presenter.psychologistList({ ...aggregate, report: saved });
  }

  async derive(id: string, dto: DeriveReportDto, actor: InternalActor) {
    const aggregate = await this.getAggregate(id);
    const summary =
      dto.non_sensitive_summary?.trim() ||
      this.privacy.buildNonSensitiveSummary(aggregate.report.messageText);

    const derivation = await this.reportsRepository.saveDerivation(
      new Derivation({
        id: generarIdSeguro('drv'),
        reportId: id,
        psychologistId: actor.id,
        adminDirectorId: dto.admin_director_id ?? null,
        nonSensitiveSummary: summary,
        status: DerivationStatus.PENDING,
        createdAt: new Date(),
      }),
    );
    await this.auditService.register({
      actorUserId: actor.id,
      action: 'DERIVE_REPORT',
      entityType: 'anonymous_report',
      entityId: id,
      metadata: { derivation_id: derivation.id },
      ip: actor.ip,
    });

    return {
      id: derivation.id,
      report_id: derivation.reportId,
      non_sensitive_summary: derivation.nonSensitiveSummary,
      status: derivation.status,
      created_at: derivation.createdAt.toISOString(),
    };
  }

  async archive(id: string, reason: string, actor: InternalActor) {
    await this.getAggregate(id);
    await this.reportsRepository.archiveReport(id, actor.id, reason);
    await this.auditService.register({
      actorUserId: actor.id,
      action: 'ARCHIVE_REPORT',
      entityType: 'anonymous_report',
      entityId: id,
      metadata: { reason },
      ip: actor.ip,
    });
    return { id, archived: true };
  }

  async listForAdminSafe(filters?: ReportFilters) {
    const aggregates = await this.reportsRepository.list(filters);
    const total = await this.reportsRepository.count(filters);
    const safe = aggregates.map((aggregate) => this.presenter.adminSafeReport(aggregate));
    return this.paginate(safe, filters, total);
  }

  async getForAdmin(id: string) {
    const aggregate = await this.ensureAnalysisIfNeeded(await this.getAggregate(id));
    if (aggregate.report.archivedAt || aggregate.report.archiveStatus === 'ARCHIVED') {
      throw new ArchivedReportError();
    }
    return this.presenter.adminDetailedReport(aggregate);
  }

  async processPendingAnalyses(limit = 10, actor?: InternalActor) {
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
    const jobs = await this.reportsRepository.claimPendingAnalysisJobs(safeLimit);
    const results = [];

    for (const report of jobs) {
      const aggregate = await this.reportsRepository.findById(report.id);
      if (aggregate?.analysis) {
        await this.reportsRepository.saveReport(report.completeAnalysis());
        results.push({
          report_id: report.id,
          public_code: report.publicCode,
          status: 'COMPLETED',
          risk_ai: aggregate.analysis.riskAi,
          persisted: true,
        });
        continue;
      }

      const outcome = await this.analyzeAndPersist(report);
      results.push({
        report_id: report.id,
        public_code: report.publicCode,
        status: outcome.status,
        risk_ai: outcome.analysis?.riskAi ?? null,
        persisted: Boolean(outcome.analysis),
        error: outcome.error ?? null,
      });
    }

    if (actor) {
      await this.auditService.register({
        actorUserId: actor.id,
        action: 'PROCESS_PENDING_AI_ANALYSIS',
        entityType: 'anonymous_report',
        entityId: 'analysis_queue',
        metadata: {
          requested_limit: safeLimit,
          claimed: jobs.length,
          completed: results.filter((item) => item.status === 'COMPLETED').length,
        },
        ip: actor.ip,
      });
    }

    return {
      requested_limit: safeLimit,
      claimed: jobs.length,
      completed: results.filter((item) => item.status === 'COMPLETED').length,
      pending_or_failed: results.filter((item) => item.status !== 'COMPLETED').length,
      results,
    };
  }

  private async ensureAnalysisIfNeeded(aggregate: ReportAggregate): Promise<ReportAggregate> {
    if (aggregate.analysis || (aggregate.report.analysisQueueStatus ?? 'PENDING') === 'COMPLETED') {
      return aggregate;
    }

    const started =
      aggregate.report.analysisQueueStatus === 'PROCESSING'
        ? aggregate.report
        : aggregate.report.startAnalysis();

    if (aggregate.report.analysisQueueStatus !== 'PROCESSING') {
      await this.reportsRepository.saveReport(started);
    }

    await this.analyzeAndPersist(started);
    return (await this.reportsRepository.findById(aggregate.report.id)) ?? aggregate;
  }

  private async analyzeAndPersist(report: AnonymousReport): Promise<{
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
    analysis?: AiAnalysis;
    error?: string;
  }> {
    try {
      const analysisResult = await this.aiAnalyzer.analyze({
        message: report.messageText,
        emotionalForm: report.emotionalForm,
      });

      const analysis = await this.reportsRepository.saveAnalysis(
        new AiAnalysis({
          id: generarIdSeguro('ana'),
          reportId: report.id,
          dominantEmotion: analysisResult.dominantEmotion,
          emotionScores: analysisResult.emotionScores,
          riskAi: analysisResult.riskAi,
          confidence: analysisResult.confidence,
          relevantSignals: analysisResult.relevantSignals,
          modelVersion: analysisResult.modelVersion,
          createdAt: new Date(),
        }),
      );

      await this.alertsService.ensureForRisk(report.id, analysis.riskAi, AlertGeneratedBy.AI);
      await this.reportsRepository.saveReport(report.completeAnalysis());
      return { status: 'COMPLETED', analysis };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Fallo desconocido en IA';
      const saved = await this.reportsRepository.saveReport(
        report.scheduleAnalysisRetry(message, null),
      );
      return {
        status: saved.analysisQueueStatus === 'FAILED' ? 'FAILED' : 'PENDING',
        error: message,
      };
    }
  }

  private async getAggregate(id: string) {
    const aggregate = await this.reportsRepository.findById(id);
    if (!aggregate) {
      throw new ReportNotFoundError();
    }
    return aggregate;
  }

  private priority(
    aggregate: { analysis?: { riskAi: RiskLevel } | null; review?: { validatedRisk: RiskLevel } | null },
  ) {
    const risk = aggregate.review?.validatedRisk ?? aggregate.analysis?.riskAi ?? RiskLevel.LOW;
    return { [RiskLevel.HIGH]: 3, [RiskLevel.MEDIUM]: 2, [RiskLevel.LOW]: 1 }[risk];
  }

  private paginate<T>(items: T[], filters?: ReportFilters, total?: number) {
    const page = Math.max(Number(filters?.page ?? 1) || 1, 1);
    const defaultLimit = items.length > 0 ? items.length : 1;
    const limit = Math.min(
      Math.max(Number(filters?.limit ?? defaultLimit) || defaultLimit, 1),
      100,
    );
    if (!filters?.page && !filters?.limit) {
      return items;
    }
    const safeTotal = Math.max(Number(total ?? items.length) || items.length, 0);
    const totalPages = Math.max(Math.ceil(safeTotal / limit), 1);
    return {
      items,
      page,
      limit,
      total: safeTotal,
      totalPages,
    };
  }
}
