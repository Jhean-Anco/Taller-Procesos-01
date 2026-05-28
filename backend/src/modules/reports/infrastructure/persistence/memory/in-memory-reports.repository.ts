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

  deleteReport(id: string): Promise<void> {
    const removeByReportId = <T extends { reportId: string }>(items: T[]) => {
      for (let index = items.length - 1; index >= 0; index -= 1) {
        if (items[index].reportId === id) {
          items.splice(index, 1);
        }
      }
    };

    for (let index = this.store.reports.length - 1; index >= 0; index -= 1) {
      if (this.store.reports[index].id === id) {
        this.store.reports.splice(index, 1);
      }
    }
    removeByReportId(this.store.analyses);
    removeByReportId(this.store.reviews);
    removeByReportId(this.store.derivations);
    return Promise.resolve();
  }

  claimPendingAnalysisJobs(limit: number): Promise<AnonymousReport[]> {
    const candidates = this.store.reports
      .filter((report) => (report.analysisQueueStatus ?? 'PENDING') === 'PENDING')
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
    const aggregates = this.store.reports
      .filter((report) => !filters?.status || report.status === filters.status)
      .filter((report) => !filters?.dateFrom || report.createdAt >= filters.dateFrom)
      .filter((report) => !filters?.dateTo || report.createdAt <= filters.dateTo)
      .map((report) => this.aggregate(report))
      .filter((item) => !filters?.risk || item.review?.validatedRisk === filters.risk || item.analysis?.riskAi === filters.risk)
      .filter((item) => !filters?.dominantEmotion || item.analysis?.dominantEmotion === filters.dominantEmotion);
    return Promise.resolve(aggregates);
  }

  count(): Promise<number> {
    return Promise.resolve(this.store.reports.length);
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
