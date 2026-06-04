import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
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

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message?: string;
  };
}

interface GeminiAnalysisPayload {
  dominant_emotion?: string;
  emotion_scores?: Record<string, number>;
  risk_ai?: string;
  confidence?: number;
  relevant_signals?: string[];
  explanation?: string;
  recommended_action?: string;
  context_summary?: string;
}

@Injectable()
export class PythonAiClientAdapter implements AiAnalyzerPort {
  private readonly serviceUrl =
    process.env.AI_SERVICE_URL ?? 'http://127.0.0.1:8000/analyze';
  private readonly timeoutMs = Number(process.env.AI_SERVICE_TIMEOUT_MS ?? 7000);
  private readonly required = process.env.AI_SERVICE_REQUIRED === 'true';
  private readonly geminiApiKey = this.readConfigValue([
    'GEMINI_API_KEY',
    'GOOGLE_API_KEY',
    'IA_API_KEY',
    'Clave de API',
  ]);
  private readonly geminiModel =
    this.readConfigValue(['GEMINI_MODEL', 'GOOGLE_AI_MODEL', 'IA_API_MODEL']) ??
    'gemini-3.1-flash-lite';
  private readonly geminiModels = this.resolveGeminiModels();
  private readonly geminiUrl =
    this.readConfigValue(['GEMINI_API_URL', 'GOOGLE_AI_API_URL']) ??
    'https://generativelanguage.googleapis.com/v1beta';
  private readonly geminiEnabledConfig = this.readConfigValue(['GEMINI_ENABLED']);
  private readonly geminiEnabled = this.geminiEnabledConfig
    ? this.geminiEnabledConfig !== 'false'
    : process.env.NODE_ENV !== 'test';
  private readonly geminiRequired =
    (this.readConfigValue(['GEMINI_REQUIRED']) ?? 'false') === 'true';

  async analyze(input: AiAnalysisInput): Promise<AiAnalysisResult> {
    if (this.geminiEnabled && this.geminiApiKey) {
      try {
        return await this.analyzeWithGemini(input);
      } catch (error) {
        if (this.geminiRequired || this.required) {
          throw new ServiceUnavailableException(
            error instanceof Error ? error.message : 'Gemini no disponible',
          );
        }
      }
    }

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
      const riskAi = data.risk_ai ?? RiskLevel.LOW;
      return {
        dominantEmotion: data.dominant_emotion ?? 'uncertain',
        emotionScores: data.emotion_scores ?? {},
        riskAi,
        confidence: data.confidence ?? null,
        relevantSignals: this.enrichLocalSignals(
          input,
          riskAi,
          data.relevant_signals ?? [],
        ),
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

  private async analyzeWithGemini(input: AiAnalysisInput): Promise<AiAnalysisResult> {
    let lastError: unknown;
    for (const model of this.geminiModels) {
      try {
        return await this.analyzeWithGeminiModel(input, model);
      } catch (error) {
        lastError = error;
        if (!this.shouldTryNextGeminiModel(error)) {
          break;
        }
      }
    }

    throw lastError instanceof Error ? lastError : new Error('Gemini no disponible');
  }

  private async analyzeWithGeminiModel(
    input: AiAnalysisInput,
    model: string,
  ): Promise<AiAnalysisResult> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const modelName = model.replace(/^models\//, '').trim();
      const endpoint = `${this.geminiUrl.replace(/\/$/, '')}/models/${modelName}:generateContent`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.geminiApiKey!,
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: this.buildGeminiPrompt(input),
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.35,
            topP: 0.9,
            responseMimeType: 'application/json',
          },
        }),
        signal: controller.signal,
      });

      const data = (await response.json()) as GeminiResponse;
      if (!response.ok) {
        throw new Error(
          `Gemini respondio ${response.status}: ${
            data.error?.message ?? 'sin detalle'
          }`,
        );
      }

      const text = data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? '')
        .join('')
        .trim();
      if (!text) {
        throw new Error('Gemini respondio sin contenido');
      }

      return this.normalizeGeminiAnalysis(this.parseGeminiJson(text), modelName);
    } finally {
      clearTimeout(timer);
    }
  }

  private shouldTryNextGeminiModel(error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return /Gemini respondio (400|404|429):/.test(message);
  }

  private buildGeminiPrompt(input: AiAnalysisInput): string {
    return [
      'Eres un asistente de convivencia escolar. Analiza un reporte anonimo de estudiante.',
      'No diagnostiques. No inventes identidades. No pidas datos personales. Prioriza seguridad, bienestar y revision humana.',
      'Devuelve SOLO JSON valido con esta forma exacta:',
      '{"dominant_emotion":"fear|sadness|anxiety|anger|neutral|uncertain","emotion_scores":{"fear":0,"sadness":0,"anxiety":0,"anger":0,"neutral":0},"risk_ai":"LOW|MEDIUM|HIGH","confidence":0.0,"relevant_signals":["..."],"explanation":"...","recommended_action":"...","context_summary":"..."}',
      'Criterios: HIGH solo si hay amenaza, violencia, abuso, autolesion, arma, golpe serio o peligro inmediato. MEDIUM si hay acoso, aislamiento, miedo, tristeza o ansiedad recurrente sin peligro inmediato. LOW si son molestias leves, orientacion general o malestar puntual.',
      'La explicacion y la recomendacion deben ser especificas del texto; evita frases genericas repetidas por nivel.',
      `Formulario emocional JSON: ${JSON.stringify(input.emotionalForm)}`,
      `Reporte anonimo: ${input.message}`,
    ].join('\n');
  }

  private parseGeminiJson(text: string): GeminiAnalysisPayload {
    const cleaned = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();
    try {
      return JSON.parse(cleaned) as GeminiAnalysisPayload;
    } catch {
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');
      if (start >= 0 && end > start) {
        return JSON.parse(cleaned.slice(start, end + 1)) as GeminiAnalysisPayload;
      }
      throw new Error('Gemini no devolvio JSON valido');
    }
  }

  private normalizeGeminiAnalysis(
    payload: GeminiAnalysisPayload,
    modelName: string,
  ): AiAnalysisResult {
    const riskAi = this.normalizeRisk(payload.risk_ai);
    const emotionScores = this.normalizeScores(payload.emotion_scores);
    const dominantEmotion = this.normalizeEmotion(payload.dominant_emotion, emotionScores);
    const relevantSignals = [
      ...this.normalizeSignals(payload.relevant_signals),
      ...this.metadataSignals(payload),
    ];

    return {
      dominantEmotion,
      emotionScores,
      riskAi,
      confidence: this.clampNumber(payload.confidence, 0, 1) ?? 0.65,
      relevantSignals,
      modelVersion: `gemini:${modelName}`,
      preliminary: true,
    };
  }

  private metadataSignals(payload: GeminiAnalysisPayload): string[] {
    return [
      payload.explanation ? `explicacion::${payload.explanation.trim()}` : null,
      payload.recommended_action ? `accion::${payload.recommended_action.trim()}` : null,
      payload.context_summary ? `resumen::${payload.context_summary.trim()}` : null,
    ].filter((item): item is string => Boolean(item));
  }

  private normalizeSignals(signals?: string[]) {
    return Array.isArray(signals)
      ? signals
          .map((signal) => String(signal).trim())
          .filter(Boolean)
          .slice(0, 8)
      : [];
  }

  private normalizeScores(scores?: Record<string, number>) {
    const normalized = {
      fear: this.clampNumber(scores?.fear, 0, 1) ?? 0,
      sadness: this.clampNumber(scores?.sadness, 0, 1) ?? 0,
      anxiety: this.clampNumber(scores?.anxiety, 0, 1) ?? 0,
      anger: this.clampNumber(scores?.anger, 0, 1) ?? 0,
      neutral: this.clampNumber(scores?.neutral, 0, 1) ?? 0,
    };
    if (Object.values(normalized).every((value) => value === 0)) {
      normalized.neutral = 0.4;
    }
    return normalized;
  }

  private normalizeRisk(risk?: string): RiskLevel {
    if (risk === RiskLevel.HIGH || risk === RiskLevel.MEDIUM || risk === RiskLevel.LOW) {
      return risk;
    }
    return RiskLevel.LOW;
  }

  private normalizeEmotion(emotion: string | undefined, scores: Record<string, number>) {
    const allowed = ['fear', 'sadness', 'anxiety', 'anger', 'neutral', 'uncertain'];
    if (emotion && allowed.includes(emotion)) {
      return emotion;
    }
    return Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'uncertain';
  }

  private clampNumber(value: unknown, min: number, max: number) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return null;
    }
    return Math.min(max, Math.max(min, numeric));
  }

  private readConfigValue(keys: string[]): string | undefined {
    for (const key of keys) {
      const value = process.env[key];
      if (value?.trim()) {
        return value.trim();
      }
    }

    for (const file of [join(process.cwd(), '.env'), join(process.cwd(), '..', '.env')]) {
      if (!existsSync(file)) {
        continue;
      }
      const env = this.readEnvFile(file);
      for (const key of keys) {
        const value = env[key];
        if (value?.trim()) {
          return value.trim();
        }
      }
    }
    return undefined;
  }

  private readEnvFile(path: string): Record<string, string> {
    return Object.fromEntries(
      readFileSync(path, 'utf8')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#') && line.includes('='))
        .map((line) => {
          const index = line.indexOf('=');
          const key = line.slice(0, index).trim();
          const value = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, '');
          return [key, value];
        }),
    );
  }

  private resolveGeminiModels() {
    const configuredFallbacks = this.readConfigValue(['GEMINI_FALLBACK_MODELS'])
      ?.split(',')
      .map((model) => model.trim())
      .filter(Boolean);
    const models = [
      this.geminiModel,
      ...(configuredFallbacks ?? ['gemini-3-flash-preview']),
    ];

    return models.filter((model, index) => model && models.indexOf(model) === index);
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
      relevantSignals: this.enrichLocalSignals(input, riskAi, relevantSignals, true),
      modelVersion: 'typescript-safety-fallback',
      preliminary: true,
    };
  }

  private enrichLocalSignals(
    input: AiAnalysisInput,
    riskAi: RiskLevel,
    signals: string[],
    degraded = false,
  ) {
    const baseSignals = degraded
      ? ['ai_service_unavailable_local_fallback', ...signals]
      : [...signals];
    const formSignals = this.describeFormSignals(input.emotionalForm).filter(
      (signal) => !baseSignals.includes(signal),
    );
    const hasMetadata = baseSignals.some(
      (signal) =>
        signal.startsWith('explicacion::') ||
        signal.startsWith('accion::') ||
        signal.startsWith('resumen::'),
    );

    return [
      ...baseSignals,
      ...formSignals.slice(0, 4),
      ...(hasMetadata
        ? []
        : this.localExplanationSignals(input, riskAi, signals, formSignals)),
    ];
  }

  private localExplanationSignals(
    input: AiAnalysisInput,
    riskAi: RiskLevel,
    signals: string[],
    formSignals: string[],
  ) {
    const signalText =
      signals.length > 0
        ? `menciona ${signals.join(', ')}`
        : 'no contiene palabras criticas directas';
    const formText =
      formSignals.length > 0
        ? `el formulario marca ${formSignals.slice(0, 3).join(', ')}`
        : 'el formulario no agrega indicadores intensos';
    const excerpt = this.messageExcerpt(input.message);
    const explanation =
      riskAi === RiskLevel.HIGH
        ? `El reporte "${excerpt}" ${signalText} y ${formText}; por eso requiere revision prioritaria.`
        : riskAi === RiskLevel.MEDIUM
          ? `El reporte "${excerpt}" ${signalText} y ${formText}; por eso se interpreta como malestar que necesita seguimiento.`
          : `El reporte "${excerpt}" ${signalText} y ${formText}; por eso se mantiene como caso preventivo.`;
    const action =
      riskAi === RiskLevel.HIGH
        ? 'Contactar al equipo responsable hoy y activar protocolo institucional.'
        : riskAi === RiskLevel.MEDIUM
          ? 'Programar seguimiento psicologico y observar el contexto reportado.'
          : 'Registrar el caso y ofrecer orientacion preventiva.';
    const summary = input.message.trim().slice(0, 180);
    return [`explicacion::${explanation}`, `accion::${action}`, `resumen::${summary}`];
  }

  private describeFormSignals(form: Record<string, unknown>) {
    const labels: Record<string, string> = {
      fear: 'miedo reportado',
      miedo: 'miedo reportado',
      anxiety: 'ansiedad reportada',
      ansiedad: 'ansiedad reportada',
      isolation: 'aislamiento',
      aislamiento: 'aislamiento',
      sadness: 'tristeza reportada',
      tristeza: 'tristeza reportada',
      school_insecurity: 'inseguridad escolar',
      recreo_solo: 'recreo en soledad',
      miedo_participar: 'miedo a participar',
      entorno_violento: 'entorno violento',
    };

    return Object.entries(form)
      .filter(([, value]) => {
        if (value === true || value === 'true' || value === '1') {
          return true;
        }
        const numeric = Number(value);
        return Number.isFinite(numeric) && numeric >= 4;
      })
      .map(([key]) => labels[key] ?? key.replace(/[_-]+/g, ' '))
      .filter((value, index, values) => values.indexOf(value) === index)
      .slice(0, 6);
  }

  private messageExcerpt(message: string) {
    const clean = message.replace(/\s+/g, ' ').trim();
    return clean.length > 140 ? `${clean.slice(0, 137)}...` : clean;
  }
}
