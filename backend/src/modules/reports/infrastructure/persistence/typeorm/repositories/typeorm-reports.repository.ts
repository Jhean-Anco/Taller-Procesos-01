import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import {
  AiAnalysis,
  AnonymousReport,
  Derivation,
  PsychologicalReview,
} from '../../../../domain/entities/report.entity';
import {
  ReportAggregate,
  ReportFilters,
  ReportsRepository,
} from '../../../../domain/repositories/reports.repository';
import { AiAnalysisOrmEntity } from '../entities/ai-analysis.orm-entity';
import { AnonymousReportOrmEntity } from '../entities/anonymous-report.orm-entity';
import { DerivationOrmEntity } from '../entities/derivation.orm-entity';
import { PsychologicalReviewOrmEntity } from '../entities/psychological-review.orm-entity';
import { ReportCryptoService } from '../../../../domain/services/report-crypto.service';

@Injectable()
export class TypeOrmReportsRepository implements ReportsRepository {
  constructor(
    @InjectRepository(AnonymousReportOrmEntity)
    private readonly reports: Repository<AnonymousReportOrmEntity>,
    @InjectRepository(AiAnalysisOrmEntity)
    private readonly analyses: Repository<AiAnalysisOrmEntity>,
    @InjectRepository(PsychologicalReviewOrmEntity)
    private readonly reviews: Repository<PsychologicalReviewOrmEntity>,
    @InjectRepository(DerivationOrmEntity)
    private readonly derivations: Repository<DerivationOrmEntity>,
    private readonly crypto: ReportCryptoService,
  ) {}

  async createReport(report: AnonymousReport): Promise<AnonymousReport> {
    const saved = await this.reports.save(this.reportToOrm(report));
    return this.reportToDomain(saved);
  }

  async saveReport(report: AnonymousReport): Promise<AnonymousReport> {
    const saved = await this.reports.save(this.reportToOrm(report));
    return this.reportToDomain(saved);
  }

  async saveAnalysis(analysis: AiAnalysis): Promise<AiAnalysis> {
    const saved = await this.analyses.save(this.analysisToOrm(analysis));
    return this.analysisToDomain(saved);
  }

  async saveReview(review: PsychologicalReview): Promise<PsychologicalReview> {
    await this.reviews.delete({ reportId: review.reportId });
    const saved = await this.reviews.save(this.reviewToOrm(review));
    return this.reviewToDomain(saved);
  }

  async saveDerivation(derivation: Derivation): Promise<Derivation> {
    const saved = await this.derivations.save(this.derivationToOrm(derivation));
    return this.derivationToDomain(saved);
  }

  async archiveReport(id: string, actorId: string, reason: string): Promise<AnonymousReport> {
    const report = await this.reports.findOneBy({ id });
    if (!report) {
      throw new NotFoundException('Reporte anonimo no encontrado');
    }

    report.archiveStatus = 'ARCHIVED';
    report.archivedAt = new Date();
    report.archivedBy = actorId;
    report.archiveReason = reason;
    report.updatedAt = new Date();
    const saved = await this.reports.save(report);
    return this.reportToDomain(saved);
  }

  async claimPendingAnalysisJobs(limit: number): Promise<AnonymousReport[]> {
    const now = new Date();
    return this.reports.manager.transaction(async (manager) => {
      const rows = await manager
        .createQueryBuilder(AnonymousReportOrmEntity, 'report')
        .setLock('pessimistic_write')
        .setOnLocked('skip_locked')
        .where('report.analysisQueueStatus = :pending', { pending: 'PENDING' })
        .andWhere('report.analysisAttempts < :maxAttempts', { maxAttempts: 10 })
        .andWhere(
          '(report.analysisNextAttemptAt IS NULL OR report.analysisNextAttemptAt <= :now)',
          { now },
        )
        .orderBy('report.analysisRequestedAt', 'ASC')
        .take(limit)
        .getMany();

      const acquired: AnonymousReport[] = [];
      for (const report of rows) {
        report.analysisQueueStatus = 'PROCESSING';
        report.analysisAttempts = (report.analysisAttempts ?? 0) + 1;
        report.analysisLastError = null;
        report.analysisWorkerId = process.env.HOSTNAME ?? 'worker-local';
        report.analysisAcquiredAt = now;
        report.updatedAt = new Date();
        const saved = await manager.save(AnonymousReportOrmEntity, report);
        acquired.push(this.reportToDomain(saved));
      }
      return acquired;
    });
  }

  async findById(id: string): Promise<ReportAggregate | null> {
    const report = await this.reports.findOneBy({ id });
    return report ? this.buildAggregate(report) : null;
  }

  async findByPublicCode(publicCode: string): Promise<ReportAggregate | null> {
    const report = await this.reports.findOneBy({ publicCode });
    return report ? this.buildAggregate(report) : null;
  }

  async list(filters?: ReportFilters): Promise<ReportAggregate[]> {
    const { reports } = await this.findPagedReports(filters);
    const aggregates = await Promise.all(reports.map((report) => this.buildAggregate(report)));
    return aggregates.filter(
      (item) =>
        !filters?.risk ||
        item.review?.validatedRisk === filters.risk ||
        item.analysis?.riskAi === filters.risk,
    ).filter(
      (item) => !filters?.dominantEmotion || item.analysis?.dominantEmotion === filters.dominantEmotion,
    );
  }

  count(filters?: ReportFilters): Promise<number> {
    return this.findPagedReports(filters).then(({ total }) => total);
  }

  private async buildAggregate(report: AnonymousReportOrmEntity): Promise<ReportAggregate> {
    const [analysis, review, derivation] = await Promise.all([
      this.analyses.findOne({ where: { reportId: report.id }, order: { createdAt: 'DESC' } }),
      this.reviews.findOne({ where: { reportId: report.id }, order: { reviewedAt: 'DESC' } }),
      this.derivations.findOne({ where: { reportId: report.id }, order: { createdAt: 'DESC' } }),
    ]);
    return {
      report: this.reportToDomain(report),
      analysis: analysis ? this.analysisToDomain(analysis) : null,
      review: review ? this.reviewToDomain(review) : null,
      derivation: derivation ? this.derivationToDomain(derivation) : null,
    };
  }

  private reportToOrm(report: AnonymousReport): AnonymousReportOrmEntity {
    const primitives = report.toPrimitives();
    return {
      ...primitives,
      messageTextCiphertext: this.crypto.encrypt(primitives.messageText),
      messageText: primitives.messageText,
    } as AnonymousReportOrmEntity;
  }

  private reportToDomain(entity: AnonymousReportOrmEntity): AnonymousReport {
    const messageText = entity.messageTextCiphertext
      ? this.crypto.decrypt(entity.messageTextCiphertext)
      : '';
    return new AnonymousReport({
      id: entity.id,
      publicCode: entity.publicCode,
      emotionalForm: entity.emotionalForm ?? {},
      messageText,
      messageTextCiphertext: entity.messageTextCiphertext,
      consentAccepted: entity.consentAccepted,
      status: entity.status,
      analysisQueueStatus: entity.analysisQueueStatus,
      analysisAttempts: entity.analysisAttempts,
      analysisNextAttemptAt: entity.analysisNextAttemptAt,
      analysisLastError: entity.analysisLastError,
      analysisRequestedAt: entity.analysisRequestedAt,
      analysisWorkerId: entity.analysisWorkerId ?? null,
      analysisAcquiredAt: entity.analysisAcquiredAt ?? null,
      archivedAt: entity.archivedAt,
      archivedBy: entity.archivedBy,
      archiveReason: entity.archiveReason,
      archiveStatus: entity.archiveStatus,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private analysisToOrm(analysis: AiAnalysis): AiAnalysisOrmEntity {
    return { ...analysis.toPrimitives() } as AiAnalysisOrmEntity;
  }

  private analysisToDomain(entity: AiAnalysisOrmEntity): AiAnalysis {
    return new AiAnalysis({
      id: entity.id,
      reportId: entity.reportId,
      dominantEmotion: entity.dominantEmotion,
      emotionScores: entity.emotionScores,
      riskAi: entity.riskAi,
      confidence: entity.confidence === null ? null : Number(entity.confidence),
      relevantSignals: entity.relevantSignals,
      modelVersion: entity.modelVersion,
      createdAt: entity.createdAt,
    });
  }

  private reviewToOrm(review: PsychologicalReview): PsychologicalReviewOrmEntity {
    return { ...review.toPrimitives() } as PsychologicalReviewOrmEntity;
  }

  private reviewToDomain(entity: PsychologicalReviewOrmEntity): PsychologicalReview {
    return new PsychologicalReview({
      id: entity.id,
      reportId: entity.reportId,
      psychologistId: entity.psychologistId,
      validatedRisk: entity.validatedRisk,
      observationInternal: entity.observationInternal,
      reviewedAt: entity.reviewedAt,
    });
  }

  private derivationToOrm(derivation: Derivation): DerivationOrmEntity {
    return { ...derivation.toPrimitives() } as DerivationOrmEntity;
  }

  private derivationToDomain(entity: DerivationOrmEntity): Derivation {
    return new Derivation({
      id: entity.id,
      reportId: entity.reportId,
      psychologistId: entity.psychologistId,
      adminDirectorId: entity.adminDirectorId,
      nonSensitiveSummary: entity.nonSensitiveSummary,
      status: entity.status,
      createdAt: entity.createdAt,
    });
  }

  private async findPagedReports(filters?: ReportFilters): Promise<{
    reports: AnonymousReportOrmEntity[];
    total: number;
  }> {
    const where: FindOptionsWhere<AnonymousReportOrmEntity> = {
      ...(filters?.status ? { status: filters.status } : {}),
      archiveStatus: 'ACTIVE',
    };
    if (filters?.dateFrom && filters?.dateTo) {
      where.createdAt = Between(filters.dateFrom, filters.dateTo);
    } else if (filters?.dateFrom) {
      where.createdAt = MoreThanOrEqual(filters.dateFrom);
    } else if (filters?.dateTo) {
      where.createdAt = LessThanOrEqual(filters.dateTo);
    }

    const page = Math.max(Number(filters?.page ?? 1) || 1, 1);
    const limitRaw = filters?.limit;
    const limit =
      typeof limitRaw === 'number' || typeof limitRaw === 'string'
        ? Math.min(Math.max(Number(limitRaw) || 50, 1), 100)
        : null;
    const qb = this.reports.createQueryBuilder('report').where(where).orderBy('report.createdAt', 'DESC');
    const total = await qb.clone().getCount();
    const reports = limit ? await qb.skip((page - 1) * limit).take(limit).getMany() : await qb.getMany();
    return { reports, total };
  }
}
