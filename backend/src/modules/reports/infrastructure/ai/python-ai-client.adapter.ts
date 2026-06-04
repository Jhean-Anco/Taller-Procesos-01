import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { RiskLevel } from '../../../shared/domain/enums';
import {
  AiAnalyzerPort,
  AiAnalysisInput,
  AiAnalysisResult,
} from '../../application/ports/ai-analyzer.port';

interface PythonAiResponse {
  dominant_emotion?: string;
  emotion_scores?: Record<string, number>;
  risk_ai?: RiskLevel;
  confidence?: number | null;
  relevant_signals?: string[];
  model_version?: string;
}

@Injectable()
export class PythonAiClientAdapter implements AiAnalyzerPort {
  private readonly serviceUrl =
    process.env.AI_SERVICE_URL ?? 'http://127.0.0.1:8000/analyze';
  private readonly timeoutMs = Number(process.env.AI_SERVICE_TIMEOUT_MS ?? 7000);
  private readonly required = process.env.AI_SERVICE_REQUIRED === 'true';

  async analyze(input: AiAnalysisInput): Promise<AiAnalysisResult> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(this.serviceUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.message,
          emotional_form: input.emotionalForm,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`IA local respondio ${response.status}`);
      }

      const data = (await response.json()) as PythonAiResponse;
      return {
        dominantEmotion: data.dominant_emotion ?? 'uncertain',
        emotionScores: data.emotion_scores ?? {},
        riskAi: data.risk_ai ?? RiskLevel.LOW,
        confidence: data.confidence ?? null,
        relevantSignals: data.relevant_signals ?? [],
        modelVersion: data.model_version ?? 'python-local-baseline',
        preliminary: true,
      };
    } catch (error) {
      if (this.required) {
        throw new ServiceUnavailableException(
          error instanceof Error ? error.message : 'IA local no disponible',
        );
      }
      return this.localSafeFallback(input);
    } finally {
      clearTimeout(timer);
    }
  }

  private localSafeFallback(input: AiAnalysisInput): AiAnalysisResult {
    const text = input.message
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const highTerms = ['matarme', 'suicidio', 'no quiero vivir', 'amenaza', 'golpe', 'abuso'];
    const mediumTerms = ['miedo', 'triste', 'ansiedad', 'solo', 'burlan', 'insultan'];
    const highMatches = highTerms.filter((term) => text.includes(term)).length;
    const mediumMatches = mediumTerms.filter((term) => text.includes(term)).length;
    const riskFormKeys = [
      'fear',
      'miedo',
      'anxiety',
      'ansiedad',
      'isolation',
      'aislamiento',
      'school_insecurity',
      'recreo_solo',
      'miedo_participar',
      'entorno_violento',
    ];
    const formRisk = riskFormKeys.filter((key) => {
      const value = input.emotionalForm[key];
      return value === true || value === 1 || value === 'true' || value === '1';
    }).length;
    const maxScore = Math.min(
      0.85,
      0.15 + mediumMatches * 0.14 + formRisk * 0.09 + highMatches * 0.28,
    );
    let riskPoints = highMatches * 3.5 + mediumMatches * 0.85 + formRisk * 0.55;
    if (maxScore >= 0.75) {
      riskPoints += 1.8;
    } else if (maxScore >= 0.55) {
      riskPoints += 1;
    } else if (maxScore >= 0.4) {
      riskPoints += 0.4;
    }
    const riskAi =
      highMatches >= 1 || riskPoints >= 6.5 || (maxScore >= 0.9 && formRisk >= 4)
        ? RiskLevel.HIGH
        : riskPoints >= 2.7 || (mediumMatches >= 2 && formRisk >= 1) || maxScore >= 0.65
          ? RiskLevel.MEDIUM
          : RiskLevel.LOW;
    const relevantSignals = [...highTerms, ...mediumTerms]
      .filter((term, index, terms) => text.includes(term) && terms.indexOf(term) === index)
      .slice(0, 8);
    return {
      dominantEmotion: mediumMatches > 0 || formRisk > 0 ? 'fear' : 'neutral',
      emotionScores: {
        fear: maxScore,
        sadness: Math.min(0.75, 0.12 + (text.includes('triste') || text.includes('solo') ? 0.28 : 0)),
        anxiety: Math.min(0.75, 0.12 + (text.includes('ansiedad') || formRisk > 1 ? 0.3 : 0)),
        anger: Math.min(0.75, 0.1 + (highMatches > 0 ? 0.34 : 0)),
      },
      riskAi,
      confidence: 0.35,
      relevantSignals: ['ai_service_unavailable_local_fallback', ...relevantSignals],
      modelVersion: 'typescript-safety-fallback',
      preliminary: true,
    };
  }
}
