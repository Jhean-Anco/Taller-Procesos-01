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
    const text = input.message.toLowerCase();
    const high = ['matarme', 'suicidio', 'amenaza', 'golpe', 'abuso'].some((term) =>
      text.includes(term),
    );
    const medium = ['miedo', 'triste', 'ansiedad', 'solo', 'burlan'].some((term) =>
      text.includes(term),
    );
    return {
      dominantEmotion: high || medium ? 'fear' : 'uncertain',
      emotionScores: {
        fear: high ? 0.75 : medium ? 0.55 : 0.2,
        sadness: medium ? 0.5 : 0.15,
        anxiety: medium ? 0.6 : 0.2,
        anger: high ? 0.4 : 0.1,
      },
      riskAi: high ? RiskLevel.HIGH : medium ? RiskLevel.MEDIUM : RiskLevel.LOW,
      confidence: 0.35,
      relevantSignals: ['ai_service_unavailable_local_fallback'],
      modelVersion: 'typescript-safety-fallback',
      preliminary: true,
    };
  }
}
