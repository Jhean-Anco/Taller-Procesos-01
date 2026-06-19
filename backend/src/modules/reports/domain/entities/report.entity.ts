import {
  DerivationStatus,
  ReportStatus,
  RiskLevel,
} from '../../../shared/domain/enums';

export interface AnonymousReportProps {
  id: string;
  publicCode: string;
  gradeReference?: string | null;
  sectionReference?: string | null;
  ageRange?: string | null;
  emotionalForm: Record<string, unknown>;
  messageText: string;
  emotionalFormCiphertext?: string | null;
  messageTextCiphertext?: string | null;
  consentAccepted: boolean;
  status: ReportStatus;
  analysisQueueStatus?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  analysisAttempts?: number;
  analysisNextAttemptAt?: Date | null;
  analysisLastError?: string | null;
  analysisRequestedAt?: Date;
  analysisWorkerId?: string | null;
  analysisAcquiredAt?: Date | null;
  archivedAt?: Date | null;
  archivedBy?: string | null;
  archiveReason?: string | null;
  archiveStatus?: 'ACTIVE' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}

export class AnonymousReport {
  constructor(private readonly props: AnonymousReportProps) {
    if (!props.consentAccepted) {
      throw new Error('El consentimiento informativo es obligatorio');
    }
  }

  get id(): string {
    return this.props.id;
  }

  get publicCode(): string {
    return this.props.publicCode;
  }

  get gradeReference(): string | null | undefined {
    return this.props.gradeReference;
  }

  get sectionReference(): string | null | undefined {
    return this.props.sectionReference;
  }

  get ageRange(): string | null | undefined {
    return this.props.ageRange;
  }

  get emotionalForm(): Record<string, unknown> {
    return { ...this.props.emotionalForm };
  }

  get emotionalFormCiphertext(): string | null | undefined {
    return this.props.emotionalFormCiphertext;
  }

  get messageText(): string {
    return this.props.messageText;
  }

  get messageTextCiphertext(): string | null | undefined {
    return this.props.messageTextCiphertext;
  }

  get consentAccepted(): boolean {
    return this.props.consentAccepted;
  }

  get status(): ReportStatus {
    return this.props.status;
  }

  get analysisQueueStatus(): 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | undefined {
    return this.props.analysisQueueStatus;
  }

  get analysisAttempts(): number | undefined {
    return this.props.analysisAttempts;
  }

  get analysisNextAttemptAt(): Date | null | undefined {
    return this.props.analysisNextAttemptAt;
  }

  get analysisLastError(): string | null | undefined {
    return this.props.analysisLastError;
  }

  get analysisRequestedAt(): Date | undefined {
    return this.props.analysisRequestedAt;
  }

  get analysisWorkerId(): string | null | undefined {
    return this.props.analysisWorkerId;
  }

  get analysisAcquiredAt(): Date | null | undefined {
    return this.props.analysisAcquiredAt;
  }

  get archivedAt(): Date | null | undefined {
    return this.props.archivedAt;
  }

  get archivedBy(): string | null | undefined {
    return this.props.archivedBy;
  }

  get archiveReason(): string | null | undefined {
    return this.props.archiveReason;
  }

  get archiveStatus(): 'ACTIVE' | 'ARCHIVED' | undefined {
    return this.props.archiveStatus;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  changeStatus(status: ReportStatus): AnonymousReport {
    return new AnonymousReport({
      ...this.props,
      status,
      updatedAt: new Date(),
    });
  }

  startAnalysis(): AnonymousReport {
    return new AnonymousReport({
      ...this.props,
      analysisQueueStatus: 'PROCESSING',
      analysisAttempts: (this.props.analysisAttempts ?? 0) + 1,
      analysisLastError: null,
      analysisWorkerId: this.props.analysisWorkerId ?? 'worker-local',
      analysisAcquiredAt: new Date(),
      updatedAt: new Date(),
    });
  }

  completeAnalysis(): AnonymousReport {
    return new AnonymousReport({
      ...this.props,
      analysisQueueStatus: 'COMPLETED',
      analysisNextAttemptAt: null,
      analysisLastError: null,
      analysisWorkerId: this.props.analysisWorkerId ?? null,
      updatedAt: new Date(),
    });
  }

  archive(actorId: string, reason: string): AnonymousReport {
    return new AnonymousReport({
      ...this.props,
      archiveStatus: 'ARCHIVED',
      archivedAt: new Date(),
      archivedBy: actorId,
      archiveReason: reason,
      updatedAt: new Date(),
    });
  }

  scheduleAnalysisRetry(errorMessage: string, retryAt: Date | null): AnonymousReport {
    const attempts = this.props.analysisAttempts ?? 0;
    const exhausted = attempts >= 10;
    return new AnonymousReport({
      ...this.props,
      analysisQueueStatus: exhausted ? 'FAILED' : 'PENDING',
      analysisNextAttemptAt: exhausted ? null : retryAt,
      analysisLastError: errorMessage,
      analysisWorkerId: this.props.analysisWorkerId ?? null,
      updatedAt: new Date(),
    });
  }

  toPrimitives(): AnonymousReportProps {
    return { ...this.props, emotionalForm: { ...this.props.emotionalForm } };
  }
}

export interface AiAnalysisProps {
  id: string;
  reportId: string;
  dominantEmotion: string;
  emotionScores: Record<string, number>;
  riskAi: RiskLevel;
  confidence?: number | null;
  relevantSignals: string[];
  modelVersion: string;
  createdAt: Date;
}

export class AiAnalysis {
  constructor(private readonly props: AiAnalysisProps) {}

  get id(): string {
    return this.props.id;
  }

  get reportId(): string {
    return this.props.reportId;
  }

  get dominantEmotion(): string {
    return this.props.dominantEmotion;
  }

  get emotionScores(): Record<string, number> {
    return { ...this.props.emotionScores };
  }

  get riskAi(): RiskLevel {
    return this.props.riskAi;
  }

  get confidence(): number | null | undefined {
    return this.props.confidence;
  }

  get relevantSignals(): string[] {
    return [...this.props.relevantSignals];
  }

  get modelVersion(): string {
    return this.props.modelVersion;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  toPrimitives(): AiAnalysisProps {
    return {
      ...this.props,
      emotionScores: { ...this.props.emotionScores },
      relevantSignals: [...this.props.relevantSignals],
    };
  }
}

export interface PsychologicalReviewProps {
  id: string;
  reportId: string;
  psychologistId: string;
  validatedRisk: RiskLevel;
  observationInternal?: string | null;
  reviewedAt: Date;
}

export class PsychologicalReview {
  constructor(private readonly props: PsychologicalReviewProps) {}

  get id(): string {
    return this.props.id;
  }

  get reportId(): string {
    return this.props.reportId;
  }

  get psychologistId(): string {
    return this.props.psychologistId;
  }

  get validatedRisk(): RiskLevel {
    return this.props.validatedRisk;
  }

  get observationInternal(): string | null | undefined {
    return this.props.observationInternal;
  }

  get reviewedAt(): Date {
    return this.props.reviewedAt;
  }

  toPrimitives(): PsychologicalReviewProps {
    return { ...this.props };
  }
}

export interface DerivationProps {
  id: string;
  reportId: string;
  psychologistId: string;
  adminDirectorId?: string | null;
  nonSensitiveSummary: string;
  status: DerivationStatus;
  createdAt: Date;
}

export class Derivation {
  constructor(private readonly props: DerivationProps) {}

  get id(): string {
    return this.props.id;
  }

  get reportId(): string {
    return this.props.reportId;
  }

  get psychologistId(): string {
    return this.props.psychologistId;
  }

  get adminDirectorId(): string | null | undefined {
    return this.props.adminDirectorId;
  }

  get nonSensitiveSummary(): string {
    return this.props.nonSensitiveSummary;
  }

  get status(): DerivationStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  toPrimitives(): DerivationProps {
    return { ...this.props };
  }
}
