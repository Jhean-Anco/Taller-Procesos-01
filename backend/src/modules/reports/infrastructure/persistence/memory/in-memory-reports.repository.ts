import { Injectable } from '@nestjs/common';
import { InstitutionalMemoryStore } from '../../../../shared/infrastructure/memory/institutional-memory-store';
import {
  AiAnalysis,
  AnonymousReport,
  Derivation,
  PsychologicalReview,
} from '../../../domain/entities/report.entity';
import {
  ReportAggregate,
  ReportFilters,
  ReportsRepository,
} from '../../../domain/repositories/reports.repository';

@Injectable()
export class InMemoryReportsRepository implements ReportsRepository {
  constructor(private readonly store: InstitutionalMemoryStore) {}

  createReport(report: AnonymousReport): Promise<AnonymousReport> {
    this.store.reports.push(report);
    return Promise.resolve(report);
  }

  saveReport(report: AnonymousReport): Promise<AnonymousReport> {
    const index = this.store.reports.findIndex((item) => item.id === report.id);
    if (index >= 0) this.store.reports[index] = report;
    return Promise.resolve(report);
  }

  saveAnalysis(analysis: AiAnalysis): Promise<AiAnalysis> {
    this.store.analyses.push(analysis);
    return Promise.resolve(analysis);
  }

  saveReview(review: PsychologicalReview): Promise<PsychologicalReview> {
    const index = this.store.reviews.findIndex((item) => item.reportId === review.reportId);
    if (index >= 0) this.store.reviews[index] = review;
    else this.store.reviews.push(review);
    return Promise.resolve(review);
  }

  saveDerivation(derivation: Derivation): Promise<Derivation> {
    this.store.derivations.push(derivation);
    return Promise.resolve(derivation);
  }

  archiveReport(id: string, actorId: string, reason: string): Promise<AnonymousReport> {
    const report = this.store.reports.find((item) => item.id === id);
    if (!report) {
      return Promise.reject(new Error('Reporte anonimo no encontrado'));
    }

    const archived = report.archive(actorId, reason);
    const index = this.store.reports.findIndex((item) => item.id === id);
    this.store.reports[index] = archived;
    return Promise.resolve(archived);
  }

  claimPendingAnalysisJobs(limit: number): Promise<AnonymousReport[]> {
    const candidates = this.store.reports
      .filter((report) => (report.analysisQueueStatus ?? 'PENDING') === 'PENDING')
      .filter((report) => (report.archiveStatus ?? 'ACTIVE') === 'ACTIVE')
      .filter((report) => (report.analysisAttempts ?? 0) < 10)
      .filter((report) => {
        if (!report.analysisNextAttemptAt) return true;
        return report.analysisNextAttemptAt <= new Date();
      })
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice(0, limit);

    const claimed = candidates.map((report) => {
      const updated = report.startAnalysis();
      this.saveReport(updated);
      return updated;
    });

    return Promise.resolve(claimed);
  }

  findById(id: string): Promise<ReportAggregate | null> {
    const report = this.store.reports.find((item) => item.id === id);
    return Promise.resolve(report ? this.aggregate(report) : null);
  }

  findByPublicCode(publicCode: string): Promise<ReportAggregate | null> {
    const report = this.store.reports.find((item) => item.publicCode === publicCode);
    return Promise.resolve(report ? this.aggregate(report) : null);
  }

  list(filters?: ReportFilters): Promise<ReportAggregate[]> {
    const aggregates = this.filteredAggregates(filters);
    const page = Math.max(Number(filters?.page ?? 1) || 1, 1);
    const defaultLimit = aggregates.length > 0 ? aggregates.length : 50;
    const limit = Math.min(
      Math.max(Number(filters?.limit ?? defaultLimit) || defaultLimit, 1),
      100,
    );
    if (!filters?.page && !filters?.limit) {
      return Promise.resolve(aggregates);
    }
    const start = (page - 1) * limit;
    return Promise.resolve(aggregates.slice(start, start + limit));
  }

  count(filters?: ReportFilters): Promise<number> {
    return Promise.resolve(this.filteredAggregates(filters).length);
  }

  private filteredAggregates(filters?: ReportFilters): ReportAggregate[] {
    const aggregates = this.store.reports
      .filter((report) => !filters?.status || report.status === filters.status)
      .filter((report) => (report.archiveStatus ?? 'ACTIVE') === 'ACTIVE')
      .filter((report) => !filters?.dateFrom || report.createdAt >= filters.dateFrom)
      .filter((report) => !filters?.dateTo || report.createdAt <= filters.dateTo)
      .map((report) => this.aggregate(report))
      .filter((item) => !filters?.risk || item.review?.validatedRisk === filters.risk || item.analysis?.riskAi === filters.risk)
      .filter((item) => !filters?.dominantEmotion || item.analysis?.dominantEmotion === filters.dominantEmotion);
    return aggregates;
  }

  private aggregate(report: AnonymousReport): ReportAggregate {
    return {
      report,
      analysis:
        [...this.store.analyses].reverse().find((item) => item.reportId === report.id) ?? null,
      review:
        [...this.store.reviews].reverse().find((item) => item.reportId === report.id) ?? null,
      derivation:
        [...this.store.derivations].reverse().find((item) => item.reportId === report.id) ?? null,
    };
  }
}
