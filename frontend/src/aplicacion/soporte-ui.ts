export type MetricMap = Record<string, number | string>;
export type RiskTier = 'LOW' | 'MEDIUM' | 'HIGH' | 'SIN_IA';
export type ReportStatusCode = 'PENDING' | 'IN_REVIEW' | 'ADDRESSED' | 'CLOSED' | string;
export type ToastKind = 'success' | 'warning' | 'error';

export function isNumericMetric(value: number | string): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function normalizeRisk(value?: string | null): RiskTier {
  const upper = value?.toUpperCase();
  if (upper === 'LOW' || upper === 'MEDIUM' || upper === 'HIGH') {
    return upper;
  }
  return 'SIN_IA';
}

export function riskLabel(value?: string | null) {
  const labels: Record<RiskTier, string> = {
    LOW: 'Bajo',
    MEDIUM: 'Moderado',
    HIGH: 'Alto',
    SIN_IA: 'Sin IA',
  };

  return labels[normalizeRisk(value)];
}

export function reportStatusLabel(value?: ReportStatusCode | null) {
  const status = (value ?? '').toUpperCase();
  const labels: Record<string, string> = {
    PENDING: 'Pendiente',
    IN_REVIEW: 'En revisión',
    ADDRESSED: 'Atendido',
    CLOSED: 'Cerrado',
  };
  return labels[status] ?? value ?? 'Sin estado';
}

export function riskTone(value?: string | null) {
  const risk = normalizeRisk(value);
  if (risk === 'HIGH') return 'tone-high';
  if (risk === 'MEDIUM') return 'tone-medium';
  if (risk === 'LOW') return 'tone-low';
  return 'tone-pending';
}

export function confidenceLabel(value?: number | null) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'sin dato';
  const score = value <= 1 ? value * 100 : value;
  if (score >= 80) return `alta confianza (${Math.round(score)}%)`;
  if (score >= 55) return `confianza media (${Math.round(score)}%)`;
  return `confianza baja (${Math.round(score)}%)`;
}

export function aiStateLabel(report?: { ai_model_version?: string | null; ai_degraded?: boolean } | null) {
  if (!report?.ai_model_version) return 'IA pendiente';
  return report.ai_degraded ? 'IA con respaldo local' : 'IA analizada';
}

export function roleLabel(value: string) {
  return value === 'ADMIN_DIRECTOR' ? 'Administrador/Director' : 'Psicólogo';
}

export function toastTitle(kind: ToastKind) {
  if (kind === 'error') return 'Error';
  if (kind === 'warning') return 'Aviso';
  return 'Listo';
}

export function toPercent(value: number) {
  return value <= 1 ? value * 100 : value;
}

export function sortMetricEntries(data: Record<string, number>) {
  return Object.entries(data).sort((a, b) => b[1] - a[1]);
}

export function describeRiskNarrative(level?: string | null, emotion?: string | null) {
  const dominantEmotion = emotion ?? 'emocion no determinada';
  const risk = normalizeRisk(level);
  if (risk === 'HIGH') {
    return `La IA detecta una lectura de alto riesgo con predominio de ${dominantEmotion}. Requiere seguimiento prioritario hoy.`;
  }
  if (risk === 'MEDIUM') {
    return `La IA ve una señal intermedia con predominio de ${dominantEmotion}. Conviene seguimiento y registro cercano.`;
  }
  if (risk === 'LOW') {
    return `La IA ubica el caso en un nivel preventivo bajo, con ${dominantEmotion} como señal dominante.`;
  }
  return 'La IA todavía no produjo una lectura clínica para este reporte.';
}

export function buildActionHint(level?: string | null) {
  const risk = normalizeRisk(level);
  if (risk === 'HIGH') return 'Abrir seguimiento y priorizar contacto presencial.';
  if (risk === 'MEDIUM') return 'Revisar contexto, registrar observacion y programar seguimiento.';
  if (risk === 'LOW') return 'Monitorear y mantener registro preventivo.';
  return 'Esperar la clasificacion automatica.';
}

export function explainAiDecision(analysis: {
  explanation?: string | null;
  risk_ai: string;
  emotion_scores: Record<string, number>;
  dominant_emotion: string;
  relevant_signals: string[];
}) {
  if (analysis.explanation?.trim()) {
    return analysis.explanation.trim();
  }

  const risk = normalizeRisk(analysis.risk_ai);
  const topEmotion = sortMetricEntries(analysis.emotion_scores)[0];
  const emotionText = topEmotion
    ? `${translateMetricLabel(topEmotion[0]).toLowerCase()} (${Math.round(toPercent(topEmotion[1]))}%)`
    : analysis.dominant_emotion;
  const signals = analysis.relevant_signals.filter(Boolean).slice(0, 4);

  if (risk === 'HIGH') {
    return `Llegó a alto porque detectó señales críticas o una acumulación fuerte de indicadores emocionales. Predomina ${emotionText}${signals.length ? ` y aparecen señales como ${signals.join(', ')}.` : '.'}`;
  }
  if (risk === 'MEDIUM') {
    return `Llegó a moderado porque hay varias señales de malestar o inseguridad, pero sin una señal crítica directa suficiente para marcar alto. Predomina ${emotionText}${signals.length ? ` y se observaron ${signals.join(', ')}.` : '.'}`;
  }
  if (risk === 'LOW') {
    return `Llegó a bajo porque no encontró señales críticas y la intensidad emocional estimada es baja o aislada. La señal dominante es ${emotionText}${signals.length ? `, con indicios leves como ${signals.join(', ')}.` : '.'}`;
  }
  return 'La IA todavía no tiene suficientes datos para explicar una clasificación.';
}

export function includesSearch(values: Array<unknown>, search: string) {
  const normalized = search.trim().toLowerCase();
  if (!normalized) return true;
  return values.some((value) => String(value ?? '').toLowerCase().includes(normalized));
}

export function humanizeKey(key: string) {
  return key
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function translateMetricLabel(label: string) {
  const normalized = label.toLowerCase().replace(/\s+/g, '_');
  const labels: Record<string, string> = {
    fear: 'Miedo',
    sadness: 'Tristeza',
    anxiety: 'Ansiedad',
    anger: 'Enojo',
    joy: 'Alegría',
    neutral: 'Neutral',
    uncertain: 'Indeterminado',
    isolation: 'Aislamiento',
    school_insecurity: 'Inseguridad escolar',
    low: 'Bajo',
    medium: 'Moderado',
    high: 'Alto',
    pending: 'Pendiente',
    processed: 'Procesado',
    fallback: 'Respaldo local',
    classified: 'Clasificado',
    reportes: 'Reportes',
    clasificados: 'Clasificados',
    ia_pendiente: 'IA pendiente',
    ia_analizada: 'IA analizada',
    ia_con_respaldo: 'IA con respaldo',
    sin_ia: 'Sin IA',
    sin_grado: 'Sin grado',
    sin_emocion: 'Sin emocion',
  };

  return labels[normalized] ?? humanizeKey(label);
}

export function countMetric<T>(items: T[], selector: (item: T) => string): MetricMap {
  return items.reduce<MetricMap>((acc, item) => {
    const key = selector(item);
    acc[key] = Number(acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

export function formatDetailValue(value: unknown) {
  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No';
  }
  if (value === null || value === undefined || value === '') {
    return 'Sin dato';
  }
  return String(value);
}
