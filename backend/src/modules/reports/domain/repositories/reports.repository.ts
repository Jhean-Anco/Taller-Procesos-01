import {
  AiAnalysis,
  AnonymousReport,
  Derivation,
  PsychologicalReview,
} from '../entities/report.entity';
import { ReportStatus, RiskLevel } from '../../../shared/domain/enums';

export const REPORTS_REPOSITORY = Symbol('REPORTS_REPOSITORY');

export interface ReportFilters {
  status?: ReportStatus;
  risk?: RiskLevel;
  dominantEmotion?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface ReportAggregate {
  report: AnonymousReport;
  analysis?: AiAnalysis | null;
  review?: PsychologicalReview | null;
  derivation?: Derivation | null;
}

export interface ReportsRepository {
  createReport(report: AnonymousReport): Promise<AnonymousReport>;
  saveReport(report: AnonymousReport): Promise<AnonymousReport>;
  saveAnalysis(analysis: AiAnalysis): Promise<AiAnalysis>;
  saveReview(review: PsychologicalReview): Promise<PsychologicalReview>;
  saveDerivation(derivation: Derivation): Promise<Derivation>;
  deleteReport(id: string): Promise<void>;
  claimPendingAnalysisJobs(limit: number): Promise<AnonymousReport[]>;
  findById(id: string): Promise<ReportAggregate | null>;
  findByPublicCode(publicCode: string): Promise<ReportAggregate | null>;
  list(filters?: ReportFilters): Promise<ReportAggregate[]>;
  count(): Promise<number>;
}
