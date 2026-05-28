import { RiskLevel } from '../../../shared/domain/enums';

export const AI_ANALYZER = Symbol('AI_ANALYZER');

export interface AiAnalysisInput {
  message: string;
  emotionalForm: Record<string, unknown>;
}

export interface AiAnalysisResult {
  dominantEmotion: string;
  emotionScores: Record<string, number>;
  riskAi: RiskLevel;
  confidence?: number | null;
  relevantSignals: string[];
  modelVersion: string;
  preliminary: true;
}

export interface AiAnalyzerPort {
  analyze(input: AiAnalysisInput): Promise<AiAnalysisResult>;
}
