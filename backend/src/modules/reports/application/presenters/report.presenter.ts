import { ReportAggregate } from '../../domain/repositories/reports.repository';
import { TextPrivacyService } from '../../domain/services/text-privacy.service';

export class ReportPresenter {
  constructor(private readonly privacy = new TextPrivacyService()) {}

  private translateEmotion(emotion?: string | null) {
    const labels: Record<string, string> = {
      fear: 'miedo',
      sadness: 'tristeza',
      anxiety: 'ansiedad',
      anger: 'enojo',
      uncertain: 'indeterminado',
      joy: 'alegría',
      neutral: 'neutral',
      isolation: 'aislamiento',
      school_insecurity: 'inseguridad escolar',
    };

    if (!emotion) return 'sin dato';
    return labels[emotion] ?? emotion.replace(/_/g, ' ');
  }

  private translateSignal(signal: string) {
    const labels: Record<string, string> = {
      ai_service_unavailable_local_fallback: 'respaldo local por indisponibilidad de IA',
    };

    return labels[signal] ?? signal.replace(/_/g, ' ');
  }

  private extractAiMetadata(signals: string[]) {
    const metadata = {
      explanation: null as string | null,
      recommendedAction: null as string | null,
      contextSummary: null as string | null,
      visibleSignals: [] as string[],
    };

    for (const signal of signals) {
      if (signal.startsWith('explicacion::')) continue;
      if (signal.startsWith('accion::')) continue;
      if (signal.startsWith('resumen::')) continue;
      const allowed = this.translateSignal(signal);
      if (allowed !== signal.replace(/_/g, ' ')) {
        metadata.visibleSignals.push(allowed);
      }
    }

    return metadata;
  }

  private translateEmotionScores(scores: Record<string, number>) {
    return Object.fromEntries(
      Object.entries(scores).map(([key, value]) => [this.translateEmotion(key), value]),
    );
  }

  private buildAiAnalysis(aggregate: ReportAggregate) {
    if (!aggregate.analysis) {
      return null;
    }

    const metadata = this.extractAiMetadata(aggregate.analysis.relevantSignals);

    return {
      dominant_emotion: this.translateEmotion(aggregate.analysis.dominantEmotion),
      emotion_scores: this.translateEmotionScores(aggregate.analysis.emotionScores),
      risk_ai: aggregate.analysis.riskAi,
      confidence: aggregate.analysis.confidence,
      relevant_signals: metadata.visibleSignals.map((signal) =>
        this.translateSignal(signal),
      ),
      explanation: 'Se identificaron indicadores anonimizados que requieren revision humana.',
      recommended_action: 'Mantener revision psicologica y seguimiento institucional.',
      context_summary: 'Resumen anonimo sin fragmentos recuperables del mensaje original.',
      model_version: aggregate.analysis.modelVersion,
      note: 'Clasificacion preliminar generada por IA; requiere revision humana.',
    };
  }

  publicResponse(reportCode: string) {
    return {
      public_code: reportCode,
      orientation:
        'Tu reporte fue enviado de manera anónima. Será revisado por el personal autorizado. Si te encuentras en peligro inmediato, acude a un adulto de confianza o al área responsable de convivencia escolar.',
    };
  }

  publicStatus(aggregate: ReportAggregate) {
    return {
      public_code: aggregate.report.publicCode,
      analysis_queue: {
        status: aggregate.report.analysisQueueStatus ?? 'PENDING',
        attempts: aggregate.report.analysisAttempts ?? 0,
        next_attempt_at: aggregate.report.analysisNextAttemptAt
          ? aggregate.report.analysisNextAttemptAt.toISOString()
          : null,
      },
      analysis_ready: (aggregate.report.analysisQueueStatus ?? 'PENDING') === 'COMPLETED',
      analysis_failed: (aggregate.report.analysisQueueStatus ?? 'PENDING') === 'FAILED',
    };
  }

  psychologistList(aggregate: ReportAggregate) {
    return {
      id: aggregate.report.id,
      public_code: aggregate.report.publicCode,
      grade_reference: aggregate.report.gradeReference,
      section_reference: aggregate.report.sectionReference,
      age_range: aggregate.report.ageRange,
      status: aggregate.report.status,
      dominant_emotion: this.translateEmotion(aggregate.analysis?.dominantEmotion ?? null),
      risk_ai: aggregate.analysis?.riskAi ?? null,
      ai_model_version: aggregate.analysis?.modelVersion ?? null,
      ai_degraded:
        aggregate.analysis?.relevantSignals.includes(
          'ai_service_unavailable_local_fallback',
        ) ?? false,
      validated_risk: aggregate.review?.validatedRisk ?? null,
      priority_risk: aggregate.review?.validatedRisk ?? aggregate.analysis?.riskAi ?? null,
      created_at: aggregate.report.createdAt.toISOString(),
      updated_at: aggregate.report.updatedAt.toISOString(),
    };
  }

  psychologistDetail(aggregate: ReportAggregate) {
    return {
      ...this.psychologistList(aggregate),
      emotional_form: aggregate.report.emotionalForm,
      message_text: aggregate.report.messageText,
      ai_analysis: this.buildAiAnalysis(aggregate),
      psychological_review: aggregate.review
        ? {
            validated_risk: aggregate.review.validatedRisk,
            observation_internal: aggregate.review.observationInternal,
            reviewed_at: aggregate.review.reviewedAt.toISOString(),
          }
        : null,
      derivation: aggregate.derivation
        ? {
            non_sensitive_summary: aggregate.derivation.nonSensitiveSummary,
            status: aggregate.derivation.status,
            created_at: aggregate.derivation.createdAt.toISOString(),
          }
        : null,
    };
  }

  adminSafeReport(aggregate: ReportAggregate) {
    return {
      id: aggregate.report.id,
      public_code: aggregate.report.publicCode,
      grade_reference: aggregate.report.gradeReference,
      section_reference: aggregate.report.sectionReference,
      age_range: aggregate.report.ageRange,
      status: aggregate.report.status,
      dominant_emotion: this.translateEmotion(aggregate.analysis?.dominantEmotion ?? null),
      risk: aggregate.review?.validatedRisk ?? aggregate.analysis?.riskAi ?? null,
      ai_model_version: aggregate.analysis?.modelVersion ?? null,
      ai_degraded:
        aggregate.analysis?.relevantSignals.includes(
          'ai_service_unavailable_local_fallback',
        ) ?? false,
      summary:
        aggregate.derivation?.nonSensitiveSummary ??
        'Resumen anonimo disponible solo para supervision autorizada.',
      created_at: aggregate.report.createdAt.toISOString(),
      updated_at: aggregate.report.updatedAt.toISOString(),
    };
  }

  adminDetailedReport(aggregate: ReportAggregate) {
    return {
      ...this.adminSafeReport(aggregate),
      derivation: aggregate.derivation
        ? {
            non_sensitive_summary: aggregate.derivation.nonSensitiveSummary,
            status: aggregate.derivation.status,
            created_at: aggregate.derivation.createdAt.toISOString(),
            admin_director_id: aggregate.derivation.adminDirectorId,
          }
        : null,
      ai_analysis: this.buildAiAnalysis(aggregate),
      analysis_queue: {
        status: aggregate.report.analysisQueueStatus ?? 'PENDING',
        attempts: aggregate.report.analysisAttempts ?? 0,
        next_attempt_at: aggregate.report.analysisNextAttemptAt
          ? aggregate.report.analysisNextAttemptAt.toISOString()
          : null,
        last_error: aggregate.report.analysisLastError ?? null,
        requested_at: aggregate.report.analysisRequestedAt
          ? aggregate.report.analysisRequestedAt.toISOString()
          : null,
      },
      sensitive_data: { available_only_for_psychologist: true },
    };
  }
}
