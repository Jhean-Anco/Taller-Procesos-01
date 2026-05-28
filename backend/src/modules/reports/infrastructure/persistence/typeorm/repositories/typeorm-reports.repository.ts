import { Injectable } from '@nestjs/common';
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

  async deleteReport(id: string): Promise<void> {
    await this.reports.delete({ id });
  }

  async claimPendingAnalysisJobs(limit: number): Promise<AnonymousReport[]> {
    const now = new Date();
    const candidates = await this.reports
      .createQueryBuilder('report')
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
    for (const report of candidates) {
      if ((report.analysisAttempts ?? 0) >= 10) {
        continue;
      }
      report.analysisQueueStatus = 'PROCESSING';
      report.analysisAttempts = (report.analysisAttempts ?? 0) + 1;
      report.analysisLastError = null;
      report.updatedAt = new Date();
      const saved = await this.reports.save(report);
      acquired.push(this.reportToDomain(saved));
    }

    return acquired;
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
    const where: FindOptionsWhere<AnonymousReportOrmEntity> = {
      ...(filters?.status ? { status: filters.status } : {}),
    };
    if (filters?.dateFrom && filters?.dateTo) {
      where.createdAt = Between(filters.dateFrom, filters.dateTo);
    } else if (filters?.dateFrom) {
      where.createdAt = MoreThanOrEqual(filters.dateFrom);
    } else if (filters?.dateTo) {
      where.createdAt = LessThanOrEqual(filters.dateTo);
    }
    const reports = await this.reports.find({ where, order: { createdAt: 'DESC' } });
    const aggregates = await Promise.all(reports.map((report) => this.buildAggregate(report)));
    return aggregates
      .filter((item) => !filters?.risk || item.review?.validatedRisk === filters.risk || item.analysis?.riskAi === filters.risk)
      .filter((item) => !filters?.dominantEmotion || item.analysis?.dominantEmotion === filters.dominantEmotion);
  }

  count(): Promise<number> {
    return this.reports.count();
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
    return { ...report.toPrimitives() } as AnonymousReportOrmEntity;
  }

  private reportToDomain(entity: AnonymousReportOrmEntity): AnonymousReport {
    return new AnonymousReport({
      id: entity.id,
      publicCode: entity.publicCode,
      gradeReference: entity.gradeReference,
      sectionReference: entity.sectionReference,
      ageRange: entity.ageRange,
      emotionalForm: entity.emotionalForm,
      messageText: entity.messageText,
      consentAccepted: entity.consentAccepted,
      status: entity.status,
      analysisQueueStatus: entity.analysisQueueStatus,
      analysisAttempts: entity.analysisAttempts,
      analysisNextAttemptAt: entity.analysisNextAttemptAt,
      analysisLastError: entity.analysisLastError,
      analysisRequestedAt: entity.analysisRequestedAt,
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
}
