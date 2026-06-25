import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type {
  AnonymousReportPayload,
  AdminReportDetail,
  AdminReportItem,
  AiAnalysisDetail,
  EmotionalFormPayload,
  AlertItem,
  InternalUserItem,
  PaginatedResponse,
  PreventiveActivityItem,
  ReportDetail,
  ReportListItem,
  Role,
  Session,
} from "./aplicacion/tipos";
import type {
  MetricMap,
  ReportStatusCode,
  RiskTier,
  ToastKind,
} from "./aplicacion/soporte-ui";
import {
  buildAnonymousReportPayload,
  initialEmotionalForm,
  validateAnonymousReportMessage,
} from "./aplicacion/reporte-anonimo.formulario";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";
const REPORT_REFRESH_MS = Number(
  import.meta.env.VITE_REPORT_REFRESH_MS ?? 10000,
);
const ORIENTATION =
  "Tu reporte fue enviado de manera anónima. Será revisado por el personal autorizado. Si te encuentras en peligro inmediato, acude a un adulto de confianza o al área responsable de convivencia escolar.";

const emotionalOptions: Array<{
  key: keyof EmotionalFormPayload;
  label: string;
  description: string;
}> = [
  {
    key: "fear",
    label: "Miedo",
    description: "Sientes temor o alerta por lo ocurrido.",
  },
  {
    key: "sadness",
    label: "Tristeza",
    description: "Te sientes decaído, afectado o sin ánimo.",
  },
  {
    key: "anxiety",
    label: "Ansiedad",
    description: "Sientes nervios, preocupación o tensión.",
  },
  {
    key: "isolation",
    label: "Aislamiento",
    description: "Prefieres apartarte o te dejan fuera del grupo.",
  },
  {
    key: "school_insecurity",
    label: "Inseguridad dentro del colegio",
    description: "No te sientes seguro en algún espacio escolar.",
  },
];

async function api<T>(
  path: string,
  token?: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message ?? `Error HTTP ${response.status}`);
  }
  return (payload?.data ?? payload) as T;
}

function isNumericMetric(value: number | string): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeRisk(value?: string | null): RiskTier {
  const upper = value?.toUpperCase();
  if (upper === "LOW" || upper === "MEDIUM" || upper === "HIGH") {
    return upper;
  }
  return "SIN_IA";
}

function riskLabel(value?: string | null) {
  const labels: Record<RiskTier, string> = {
    LOW: "Bajo",
    MEDIUM: "Moderado",
    HIGH: "Alto",
    SIN_IA: "Sin IA",
  };

  return labels[normalizeRisk(value)];
}

function reportStatusLabel(value?: ReportStatusCode | null) {
  const status = (value ?? "").toUpperCase();
  const labels: Record<string, string> = {
    PENDING: "Pendiente",
    IN_REVIEW: "En revisión",
    ADDRESSED: "Atendido",
    CLOSED: "Cerrado",
  };
  return labels[status] ?? value ?? "Sin estado";
}

function riskTone(value?: string | null) {
  const risk = normalizeRisk(value);
  if (risk === "HIGH") return "tone-high";
  if (risk === "MEDIUM") return "tone-medium";
  if (risk === "LOW") return "tone-low";
  return "tone-pending";
}

function confidenceLabel(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return "sin dato";
  const score = value <= 1 ? value * 100 : value;
  if (score >= 80) return `alta confianza (${Math.round(score)}%)`;
  if (score >= 55) return `confianza media (${Math.round(score)}%)`;
  return `confianza baja (${Math.round(score)}%)`;
}

function aiStateLabel(
  report?: { ai_model_version?: string | null; ai_degraded?: boolean } | null,
) {
  if (!report?.ai_model_version) return "IA pendiente";
  return report.ai_degraded ? "IA con respaldo local" : "IA analizada";
}

function roleLabel(value: string) {
  return value === "ADMIN_DIRECTOR" ? "Administrador/Director" : "Psicólogo";
}

function toastTitle(kind: ToastKind) {
  if (kind === "error") return "Error";
  if (kind === "warning") return "Aviso";
  return "Listo";
}

function toPercent(value: number) {
  return value <= 1 ? value * 100 : value;
}

function sortMetricEntries(data: Record<string, number>) {
  return Object.entries(data).sort((a, b) => b[1] - a[1]);
}

function describeRiskNarrative(level?: string | null, emotion?: string | null) {
  const dominantEmotion = emotion ?? "emocion no determinada";
  const risk = normalizeRisk(level);
  if (risk === "HIGH") {
    return `La IA detecta una lectura de alto riesgo con predominio de ${dominantEmotion}. Requiere seguimiento prioritario hoy.`;
  }
  if (risk === "MEDIUM") {
    return `La IA ve una señal intermedia con predominio de ${dominantEmotion}. Conviene seguimiento y registro cercano.`;
  }
  if (risk === "LOW") {
    return `La IA ubica el caso en un nivel preventivo bajo, con ${dominantEmotion} como señal dominante.`;
  }
  return "La IA todavía no produjo una lectura clínica para este reporte.";
}

function buildActionHint(level?: string | null) {
  const risk = normalizeRisk(level);
  if (risk === "HIGH")
    return "Abrir seguimiento y priorizar contacto presencial.";
  if (risk === "MEDIUM")
    return "Revisar contexto, registrar observacion y programar seguimiento.";
  if (risk === "LOW") return "Monitorear y mantener registro preventivo.";
  return "Esperar la clasificacion automatica.";
}

function explainAiDecision(analysis: AiAnalysisDetail) {
  if (analysis.explanation?.trim()) {
    return analysis.explanation.trim();
  }

  const risk = normalizeRisk(analysis.risk_ai);
  const topEmotion = sortMetricEntries(analysis.emotion_scores)[0];
  const emotionText = topEmotion
    ? `${translateMetricLabel(topEmotion[0]).toLowerCase()} (${Math.round(toPercent(topEmotion[1]))}%)`
    : analysis.dominant_emotion;
  const signals = analysis.relevant_signals.filter(Boolean).slice(0, 4);

  if (risk === "HIGH") {
    return `Llegó a alto porque detectó señales críticas o una acumulación fuerte de indicadores emocionales. Predomina ${emotionText}${signals.length ? ` y aparecen señales como ${signals.join(", ")}.` : "."}`;
  }
  if (risk === "MEDIUM") {
    return `Llegó a moderado porque hay varias señales de malestar o inseguridad, pero sin una señal crítica directa suficiente para marcar alto. Predomina ${emotionText}${signals.length ? ` y se observaron ${signals.join(", ")}.` : "."}`;
  }
  if (risk === "LOW") {
    return `Llegó a bajo porque no encontró señales críticas y la intensidad emocional estimada es baja o aislada. La señal dominante es ${emotionText}${signals.length ? `, con indicios leves como ${signals.join(", ")}.` : "."}`;
  }
  return "La IA todavía no tiene suficientes datos para explicar una clasificación.";
}

function matchesAiFilter(
  report: { ai_model_version?: string | null; ai_degraded?: boolean },
  aiFilter: string,
) {
  if (aiFilter === "ALL") return true;
  if (aiFilter === "PENDING") return !report.ai_model_version;
  if (aiFilter === "FALLBACK") return Boolean(report.ai_degraded);
  if (aiFilter === "ANALYZED")
    return Boolean(report.ai_model_version) && !report.ai_degraded;
  return true;
}

function includesSearch(values: Array<unknown>, search: string) {
  const normalized = search.trim().toLowerCase();
  if (!normalized) return true;
  return values.some((value) =>
    String(value ?? "")
      .toLowerCase()
      .includes(normalized),
  );
}

function humanizeKey(key: string) {
  return key
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function translateMetricLabel(label: string) {
  const normalized = label.toLowerCase().replace(/\s+/g, "_");
  const labels: Record<string, string> = {
    fear: "Miedo",
    sadness: "Tristeza",
    anxiety: "Ansiedad",
    anger: "Enojo",
    joy: "Alegría",
    neutral: "Neutral",
    uncertain: "Indeterminado",
    isolation: "Aislamiento",
    school_insecurity: "Inseguridad escolar",
    low: "Bajo",
    medium: "Moderado",
    high: "Alto",
    pending: "Pendiente",
    processed: "Procesado",
    fallback: "Respaldo local",
    classified: "Clasificado",
    reportes: "Reportes",
    clasificados: "Clasificados",
    ia_pendiente: "IA pendiente",
    ia_analizada: "IA analizada",
    ia_con_respaldo: "IA con respaldo",
    sin_ia: "Sin IA",
    sin_grado: "Sin grado",
    sin_emocion: "Sin emocion",
  };

  return labels[normalized] ?? humanizeKey(label);
}

function countMetric<T>(items: T[], selector: (item: T) => string): MetricMap {
  return items.reduce<MetricMap>((acc, item) => {
    const key = selector(item);
    acc[key] = Number(acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

function formatDetailValue(value: unknown) {
  if (typeof value === "boolean") {
    return value ? "Sí" : "No";
  }
  if (value === null || value === undefined || value === "") {
    return "Sin dato";
  }
  return String(value);
}

function BarChart({
  title,
  data,
  note,
}: {
  title: string;
  data: MetricMap;
  note?: string;
}) {
  const entries = Object.entries(data);
  const numericEntries = entries.filter(([, value]) =>
    isNumericMetric(value),
  ) as Array<[string, number]>;
  const maxValue = numericEntries.reduce(
    (max, [, value]) => Math.max(max, value),
    0,
  );

  return (
    <section className="panel chart-panel">
      <div className="section-head">
        <h2>{title}</h2>
        {note && <span>{note}</span>}
      </div>
      {numericEntries.length > 0 ? (
        <div className="chart-bars">
          {numericEntries.map(([label, value]) => (
            <div key={label} className="chart-row">
              <div className="chart-labels">
                <span>{translateMetricLabel(label)}</span>
                <strong>{value}</strong>
              </div>
              <div className="chart-track">
                <div
                  className="chart-fill"
                  style={{
                    width: `${maxValue === 0 ? 0 : Math.max(6, (value / maxValue) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="muted">
          No hay datos numéricos suficientes para graficar.
        </p>
      )}

      {entries.some(([, value]) => !isNumericMetric(value)) && (
        <div className="signal-list">
          {entries
            .filter(([, value]) => !isNumericMetric(value))
            .map(([label, value]) => (
              <span key={label}>
                {translateMetricLabel(label)}: {String(value)}
              </span>
            ))}
        </div>
      )}
    </section>
  );
}

export default function Aplicacion() {
  const [session, setSession] = useState<Session | null>(() => {
    const raw = sessionStorage.getItem("safeschool_session");
    return raw ? (JSON.parse(raw) as Session) : null;
  });
  const [screen, setScreen] = useState<
    "public" | "login" | "psychologist" | "admin"
  >("public");
  const [toasts, setToasts] = useState<
    Array<{ id: string; kind: ToastKind; message: string }>
  >([]);

  useEffect(() => {
    if (!session) return;
    sessionStorage.setItem("safeschool_session", JSON.stringify(session));
    const isAdmin =
      session.usuario.rol === "ADMIN_DIRECTOR" ||
      session.usuario.rol === "admin";
    setScreen(isAdmin ? "admin" : "psychologist");
  }, [session]);

  const logout = () => {
    sessionStorage.removeItem("safeschool_session");
    setSession(null);
    setScreen("public");
  };

  const notify = (message: string, kind: ToastKind = "success") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((current) => [...current, { id, kind, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            A
          </div>
          <div className="topbar-copy">
            <p className="eyebrow">Colegio Agora</p>
            <h1>Convivencia y bienestar escolar</h1>
            <p className="muted">
              Seguimiento anónimo, lectura IA y revisión psicológica con foco
              operativo.
            </p>
          </div>
        </div>
        <nav>
          {!session && (
            <button
              onClick={() => setScreen(screen === "login" ? "public" : "login")}
            >
              {screen === "login" ? "Reporte anónimo" : "Acceso interno"}
            </button>
          )}
          {session && <span>{session.usuario.nombre}</span>}
          {session && <button onClick={logout}>Salir</button>}
        </nav>
      </header>

      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.kind}`}>
            <strong>{toastTitle(toast.kind)}</strong>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {screen === "public" && <PublicReport />}
      {screen === "login" && <Login onLogin={setSession} />}
      {session && screen === "psychologist" && (
        <PsychologistPanel token={session.accessToken} notify={notify} />
      )}
      {session && screen === "admin" && (
        <AdminPanel token={session.accessToken} notify={notify} />
      )}
    </div>
  );
}

function PublicReport() {
  const [message, setMessage] = useState("");
  const [emotionalForm, setEmotionalForm] =
    useState<EmotionalFormPayload>(initialEmotionalForm);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    public_code: string;
    orientation: string;
  } | null>(null);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const messageValidation = validateAnonymousReportMessage(message);
    if (!messageValidation.valid) {
      setError(messageValidation.message);
      return;
    }
    if (!consent) {
      setError("Debes aceptar el consentimiento antes de enviar el reporte.");
      return;
    }
    if (loading) return;
    if (
      !window.confirm("¿Enviar este reporte anónimo para revisión autorizada?")
    )
      return;
    setLoading(true);
    try {
      const payload: AnonymousReportPayload = buildAnonymousReportPayload(
        emotionalForm,
        messageValidation.trimmedMessage,
      );
      const response = await api<{ public_code: string; orientation: string }>(
        "/anonymous-reports",
        undefined,
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );
      setResult(response);
      setMessage("");
      setEmotionalForm(initialEmotionalForm);
      setConsent(false);
    } catch (caught) {
      console.error("Error al enviar reporte anónimo", caught);
      setError(
        "No pudimos enviar el reporte. Verifica tu conexión e inténtalo nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <main className="public-grid">
        <section className="panel success-panel">
          <p className="eyebrow">Reporte recibido</p>
          <h2>{result.public_code}</h2>
          <p>{result.orientation || ORIENTATION}</p>
          <button onClick={() => setResult(null)}>Enviar otro reporte</button>
        </section>
      </main>
    );
  }

  return (
    <main className="public-grid">
      <form className="panel report-form" onSubmit={submit}>
        <div className="form-brand-strip" aria-hidden="true">
          <span>Colegio Agora</span>
          <strong>Canal de cuidado escolar</strong>
        </div>
        <div>
          <p className="eyebrow">Canal anónimo</p>
          <h2>Cuéntanos qué está ocurriendo</h2>
          <p className="muted">
            No escribas nombres, DNI, telefonos, correos ni direcciones. El
            reporte se usa solo con fines preventivos.
          </p>
        </div>

        <fieldset className="emotion-section">
          <legend>¿Cómo te hace sentir esta situación?</legend>
          <p className="muted">
            Puedes seleccionar una o varias emociones. Si ninguna opción
            describe lo que sientes, puedes dejar todas sin marcar.
          </p>
          <div className="emotion-grid-options">
            {emotionalOptions.map((option) => {
              const checked = emotionalForm[option.key];
              const inputId = `emotion-${option.key}`;
              return (
                <label
                  key={option.key}
                  htmlFor={inputId}
                  className={`emotion-option ${checked ? "is-selected" : ""}`}
                >
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={checked}
                    onChange={(event) =>
                      setEmotionalForm((current) => ({
                        ...current,
                        [option.key]: event.target.checked,
                      }))
                    }
                  />
                  <span className="emotion-copy">
                    <strong>{option.label}</strong>
                    <small>{option.description}</small>
                  </span>
                  <span className="selection-state">
                    {checked ? "Seleccionado" : "Sin seleccionar"}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <label>
          Cuéntanos qué está ocurriendo
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            minLength={30}
            maxLength={500}
            required
            placeholder="Describe la situación con tus propias palabras. No incluyas nombres, teléfonos, direcciones ni otros datos que permitan identificarte."
          />
          <span className="field-help">
            Tu reporte será tratado de manera confidencial. Evita escribir
            información personal o identificable.
          </span>
          <span
            className={`character-counter ${message.trim().length > 500 ? "is-invalid" : ""}`}
          >
            {message.trim().length} de 500 caracteres. Mínimo 30 caracteres.
          </span>
        </label>

        <label className="consent">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
          />
          He leído la información y acepto enviar este reporte anónimo para que
          pueda ser revisado por el personal responsable.
        </label>

        {error && <p className="error">{error}</p>}
        <button disabled={loading}>
          {loading ? "Enviando reporte..." : "Enviar reporte anónimo"}
        </button>
      </form>
    </main>
  );
}

function Login({ onLogin }: { onLogin: (session: Session) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      const session = await api<Session>("/auth/login", undefined, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      onLogin(session);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Credenciales invalidas",
      );
    }
  };

  return (
    <main className="narrow">
      <form className="panel auth-panel" onSubmit={submit}>
        <p className="eyebrow">Acceso interno</p>
        <h2>Ingreso de personal autorizado</h2>
        <p className="muted">
          Psicólogo y administrador acceden desde aquí para revisar reportes,
          seguimiento e indicadores IA.
        </p>
        <label>
          Correo
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
          />
        </label>
        <label>
          Contrasena
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button>Iniciar sesión</button>
      </form>
    </main>
  );
}

function PsychologistPanel({
  token,
  notify,
}: {
  token: string;
  notify: (message: string, kind?: ToastKind) => void;
}) {
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [detail, setDetail] = useState<ReportDetail | null>(null);
  const [risk, setRisk] = useState("LOW");
  const [observation, setObservation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [aiFilter, setAiFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const open = useCallback(
    async (id: string) => {
      setError("");
      try {
        const response = await api<ReportDetail>(
          `/psychologist/reports/${id}`,
          token,
        );
        setDetail(response);
        setRisk(response.validated_risk ?? response.risk_ai ?? "LOW");
        setReports((current) =>
          current.map((report) =>
            report.id === response.id
              ? {
                  ...report,
                  dominant_emotion:
                    response.ai_analysis?.dominant_emotion ??
                    report.dominant_emotion,
                  risk_ai: response.ai_analysis?.risk_ai ?? report.risk_ai,
                  ai_model_version:
                    response.ai_analysis?.model_version ??
                    report.ai_model_version,
                  ai_degraded:
                    response.ai_analysis?.relevant_signals.includes(
                      "respaldo local por indisponibilidad de IA",
                    ) ?? report.ai_degraded,
                  priority_risk:
                    response.validated_risk ??
                    response.ai_analysis?.risk_ai ??
                    report.priority_risk,
                }
              : report,
          ),
        );
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "No se pudo abrir el reporte.",
        );
      }
    },
    [token],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const reportsData = await api<ReportListItem[]>(
        "/psychologist/reports",
        token,
      );
      setReports(reportsData);

      const currentStillExists = detail
        ? reportsData.some((report) => report.id === detail.id)
        : false;
      if (!currentStillExists) {
        setDetail(null);
        setRisk("LOW");
      }
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "No se pudieron cargar los reportes.",
      );
    } finally {
      setLoading(false);
    }
  }, [detail, token]);

  useEffect(() => {
    void load();
  }, [token]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void load();
    }, REPORT_REFRESH_MS);

    return () => window.clearInterval(timer);
  }, [load]);

  const review = async () => {
    if (!detail) return;
    await api(`/psychologist/reports/${detail.id}/review`, token, {
      method: "POST",
      body: JSON.stringify({
        validated_risk: risk,
        observation_internal: observation,
      }),
    });
    setObservation("");
    notify("La revisión fue guardada.");
    await open(detail.id);
    await load();
  };

  const sendToDirector = async () => {
    if (!detail) return;
    await api(`/psychologist/reports/${detail.id}/derive`, token, {
      method: "POST",
      body: JSON.stringify({}),
    });
    notify("El reporte fue enviado al director.", "success");
    await open(detail.id);
    await load();
  };

  const remove = async () => {
    if (!detail) return;
    if (!window.confirm("¿Eliminar este reporte anónimo?")) return;
    const reason = window.prompt("Motivo del archivado");
    if (!reason?.trim()) return;
    await api(`/psychologist/reports/${detail.id}/archive`, token, {
      method: "PATCH",
      body: JSON.stringify({ reason: reason.trim() }),
    });
    notify("El reporte fue archivado.", "warning");
    setDetail(null);
    await load();
  };

  const detailAnalysis = detail?.ai_analysis ?? null;
  const filteredReports = useMemo(
    () =>
      reports.filter((report) => {
        const reportRisk = normalizeRisk(
          report.priority_risk ?? report.validated_risk ?? report.risk_ai,
        );
        const statusMatches =
          statusFilter === "ALL" || report.status === statusFilter;
        const riskMatches = riskFilter === "ALL" || reportRisk === riskFilter;
        const aiMatches = matchesAiFilter(report, aiFilter);
        const textMatches = includesSearch(
          [
            report.public_code,
            report.status,
            report.dominant_emotion,
            riskLabel(
              report.priority_risk ?? report.validated_risk ?? report.risk_ai,
            ),
          ],
          search,
        );
        return statusMatches && riskMatches && aiMatches && textMatches;
      }),
    [aiFilter, reports, riskFilter, search, statusFilter],
  );
  const reportInsights = useMemo(() => {
    const total = filteredReports.length;
    const highRisk = filteredReports.filter(
      (report) =>
        normalizeRisk(
          report.priority_risk ?? report.validated_risk ?? report.risk_ai,
        ) === "HIGH",
    ).length;
    const fallback = filteredReports.filter(
      (report) => report.ai_degraded,
    ).length;
    const pending = filteredReports.filter(
      (report) => !report.ai_model_version,
    ).length;
    return {
      total,
      highRisk,
      fallback,
      pending,
      analyzed: total - pending,
    };
  }, [filteredReports]);
  const detailEmotionEntries = useMemo(
    () =>
      detailAnalysis
        ? sortMetricEntries(detailAnalysis.emotion_scores)
            .slice(0, 5)
            .map(
              ([emotion, value]) =>
                [translateMetricLabel(emotion), toPercent(value)] as const,
            )
        : [],
    [detailAnalysis],
  );
  const psychologistRiskStats = useMemo<MetricMap>(
    () =>
      countMetric(filteredReports, (report) =>
        riskLabel(
          report.priority_risk ?? report.validated_risk ?? report.risk_ai,
        ),
      ),
    [filteredReports],
  );
  const psychologistStatusStats = useMemo<MetricMap>(
    () =>
      countMetric(filteredReports, (report) =>
        reportStatusLabel(report.status),
      ),
    [filteredReports],
  );
  const psychologistAiStats = useMemo<MetricMap>(
    () => countMetric(filteredReports, (report) => aiStateLabel(report)),
    [filteredReports],
  );

  return (
    <main className="workspace">
      <section className="panel full-row insight-strip">
        <div className="section-head">
          <h2>Lectura operativa de la IA</h2>
          <span>{reportInsights.analyzed} analizados</span>
        </div>
        <div className="stat-strip compact">
          <div>
            <span>Total reportes</span>
            <strong>{reportInsights.total}</strong>
          </div>
          <div>
            <span>Seguimiento alto</span>
            <strong>{reportInsights.highRisk}</strong>
          </div>
          <div>
            <span>IA con respaldo</span>
            <strong>{reportInsights.fallback}</strong>
          </div>
          <div>
            <span>IA pendiente</span>
            <strong>{reportInsights.pending}</strong>
          </div>
        </div>
        <p className="muted">
          La columna de la izquierda prioriza urgencia. El panel central traduce
          la señal IA a criterios de seguimiento.
        </p>
      </section>

      <BarChart
        title="Riesgo priorizado"
        data={psychologistRiskStats}
        note="IA o validacion humana"
      />
      <BarChart
        title="Estado de revision"
        data={psychologistStatusStats}
        note="Flujo psicologico"
      />
      <BarChart
        title="Cobertura IA"
        data={psychologistAiStats}
        note="Pendiente, analizada o respaldo"
      />
      <BarChart
        title="Reportes por estado"
        data={psychologistStatusStats}
        note="Distribucion de carga"
      />

      <section className="panel list-panel">
        <div className="section-head">
          <h2>Reportes anónimos</h2>
          <span>
            {filteredReports.length} de {reports.length}
          </span>
        </div>
        <div className="filter-bar">
          <label>
            Buscar
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Código, grado, emoción o estado"
            />
          </label>
          <label>
            Riesgo
            <select
              value={riskFilter}
              onChange={(event) => setRiskFilter(event.target.value)}
            >
              <option value="ALL">Todos</option>
              <option value="LOW">Bajo</option>
              <option value="MEDIUM">Moderado</option>
              <option value="HIGH">Alto</option>
              <option value="SIN_IA">Sin IA</option>
            </select>
          </label>
          <label>
            Estado
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="ALL">Todos</option>
              <option value="PENDING">Pendiente</option>
              <option value="IN_REVIEW">En revisión</option>
              <option value="ADDRESSED">Atendido</option>
              <option value="CLOSED">Cerrado</option>
            </select>
          </label>
          <label>
            IA
            <select
              value={aiFilter}
              onChange={(event) => setAiFilter(event.target.value)}
            >
              <option value="ALL">Todas</option>
              <option value="PENDING">Pendiente</option>
              <option value="ANALYZED">Analizada</option>
              <option value="FALLBACK">Con respaldo</option>
            </select>
          </label>
        </div>
        {loading && <p className="muted">Cargando reportes...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && reports.length === 0 && (
          <p className="muted">No hay reportes registrados.</p>
        )}
        {!loading && reports.length > 0 && filteredReports.length === 0 && (
          <p className="muted">
            No hay reportes que coincidan con los filtros.
          </p>
        )}
        <div className="table-list report-stack">
          {filteredReports.map((report) => (
            <button
              key={report.id}
              type="button"
              className={`row-button report-row ${riskTone(report.priority_risk ?? report.validated_risk ?? report.risk_ai)} ${detail?.id === report.id ? "is-active" : ""}`}
              onClick={() => open(report.id)}
            >
              <span className="report-row-main">
                <strong>{report.public_code}</strong>
                <small>{reportStatusLabel(report.status)}</small>
                <small>
                  {new Date(report.created_at).toLocaleDateString("es-PE")} /{" "}
                  {report.dominant_emotion ?? "sin emoción"}
                </small>
                <span className="report-tags">
                  <span>
                    {riskLabel(
                      report.priority_risk ??
                        report.validated_risk ??
                        report.risk_ai,
                    )}
                  </span>
                  <span>{aiStateLabel(report)}</span>
                  <span>
                    {report.status === "PENDING"
                      ? "Pendiente de revisión"
                      : "Con seguimiento"}
                  </span>
                </span>
              </span>
              <span className="ai-stack">
                <strong
                  className={`risk-chip ${riskTone(report.priority_risk ?? report.validated_risk ?? report.risk_ai)}`}
                >
                  {riskLabel(
                    report.priority_risk ??
                      report.validated_risk ??
                      report.risk_ai,
                  )}
                </strong>
                <small>{report.dominant_emotion ?? "emocion pendiente"}</small>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel detail-panel">
        <h2>Revision psicologica</h2>
        {!detail && (
          <p className="muted">
            Selecciona un reporte para revisar contenido anónimo y análisis
            local.
          </p>
        )}
        {detail && (
          <>
            <div className="detail-head">
              <span>{detail.public_code}</span>
              <strong
                className={`risk-chip ${riskTone(detail.priority_risk ?? detail.validated_risk ?? detail.risk_ai)}`}
              >
                {riskLabel(
                  detail.priority_risk ??
                    detail.validated_risk ??
                    detail.risk_ai,
                )}
              </strong>
            </div>
            <p className="message-box">{detail.message_text}</p>
            <div className="detail-meta-grid">
              <div>
                <span>Estado</span>
                <strong>{reportStatusLabel(detail.status)}</strong>
              </div>
              <div>
                <span>Creado</span>
                <strong>
                  {new Date(detail.created_at).toLocaleString("es-PE")}
                </strong>
              </div>
              <div>
                <span>Actualizado</span>
                <strong>
                  {new Date(
                    detail.updated_at ?? detail.created_at,
                  ).toLocaleString("es-PE")}
                </strong>
              </div>
            </div>
            <div className="ai-panel">
              <div className="section-head">
                <h3>Revision IA</h3>
                <span>{aiStateLabel(detail)}</span>
              </div>
              {detailAnalysis ? (
                <>
                  <div
                    className={`ai-summary ${riskTone(detailAnalysis.risk_ai)}`}
                  >
                    <p className="ai-summary-title">
                      La IA ve este caso como{" "}
                      {riskLabel(detailAnalysis.risk_ai).toLowerCase()}.
                    </p>
                    <p className="ai-summary-body">
                      {detailAnalysis.context_summary ??
                        describeRiskNarrative(
                          detailAnalysis.risk_ai,
                          detailAnalysis.dominant_emotion,
                        )}
                    </p>
                    <p className="ai-decision">
                      {explainAiDecision(detailAnalysis)}
                    </p>
                    <div className="ai-summary-meta">
                      <span>
                        Emocion dominante: {detailAnalysis.dominant_emotion}
                      </span>
                      <span>
                        Confianza: {confidenceLabel(detailAnalysis.confidence)}
                      </span>
                      <span>
                        Accion sugerida:{" "}
                        {detailAnalysis.recommended_action ??
                          buildActionHint(detailAnalysis.risk_ai)}
                      </span>
                    </div>
                  </div>
                  <div className="signal-list">
                    {detailAnalysis.relevant_signals.length > 0 ? (
                      detailAnalysis.relevant_signals.map((signal) => (
                        <span key={signal}>{signal}</span>
                      ))
                    ) : (
                      <span>sin señales destacadas</span>
                    )}
                  </div>
                  <div className="emotion-grid">
                    {detailEmotionEntries.length > 0 ? (
                      detailEmotionEntries.map(([emotion, value]) => (
                        <div className="emotion-row" key={emotion}>
                          <div className="emotion-head">
                            <span>{emotion}</span>
                            <strong>{Math.round(value)}%</strong>
                          </div>
                          <div className="emotion-track">
                            <div
                              className="emotion-fill"
                              style={{ width: `${Math.max(6, value)}%` }}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="muted">
                        No hay distribucion emocional para mostrar.
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <p className="error">
                  La clasificacion IA aun no esta disponible para este reporte.
                </p>
              )}
            </div>
            <label>
              Riesgo validado
              <select
                value={risk}
                onChange={(event) => setRisk(event.target.value)}
              >
                <option value="LOW">Bajo</option>
                <option value="MEDIUM">Moderado</option>
                <option value="HIGH">Alto</option>
              </select>
            </label>
            <label>
              Observacion interna
              <textarea
                value={observation}
                onChange={(event) => setObservation(event.target.value)}
              />
            </label>
            <div className="actions">
              <button type="button" onClick={review}>
                Guardar revisión
              </button>
              <button type="button" onClick={sendToDirector}>
                Enviar al director
              </button>
              <button type="button" className="ghost-button" onClick={remove}>
                Eliminar
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function AdminPanel({
  token,
  notify,
}: {
  token: string;
  notify: (message: string, kind?: ToastKind) => void;
}) {
  const [summary, setSummary] = useState<Record<string, unknown>>({});
  const [activities, setActivities] = useState<PreventiveActivityItem[]>([]);
  const [users, setUsers] = useState<InternalUserItem[]>([]);
  const [adminReports, setAdminReports] = useState<AdminReportItem[]>([]);
  const [selectedAdminReportId, setSelectedAdminReportId] = useState<
    string | null
  >(null);
  const [selectedAdminReport, setSelectedAdminReport] =
    useState<AdminReportDetail | null>(null);
  const [adminDetailLoading, setAdminDetailLoading] = useState(false);
  const [analysisProcessing, setAnalysisProcessing] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("Temporal123*");
  const [userRole, setUserRole] = useState("PSYCHOLOGIST");
  const [userActive, setUserActive] = useState(true);
  const [createdCredential, setCreatedCredential] = useState<{
    email: string;
    password: string;
    role: string;
  } | null>(null);
  const [adminRiskFilter, setAdminRiskFilter] = useState("ALL");
  const [adminStatusFilter, setAdminStatusFilter] = useState("ALL");
  const [adminAiFilter, setAdminAiFilter] = useState("ALL");
  const [adminSearch, setAdminSearch] = useState("");
  const [adminReportsPage, setAdminReportsPage] = useState(1);
  const [adminReportsLimit, setAdminReportsLimit] = useState(10);
  const [adminReportsMeta, setAdminReportsMeta] = useState({
    total: 0,
    totalPages: 1,
  });

  const load = useCallback(async () => {
    setError("");
    try {
      const [summaryData, activityData, reportsData, usersData] =
        await Promise.all([
          api<Record<string, unknown>>("/dashboard/summary", token),
          api<PreventiveActivityItem[]>("/preventive-activities", token),
          api<AdminReportItem[] | PaginatedResponse<AdminReportItem>>(
            `/dashboard/reports?page=${adminReportsPage}&limit=${adminReportsLimit}`,
            token,
          ),
          api<InternalUserItem[]>("/users", token),
        ]);
      setSummary(summaryData);
      setActivities(activityData);
      if (Array.isArray(reportsData)) {
        setAdminReports(reportsData);
        setAdminReportsMeta({
          total: reportsData.length,
          totalPages: Math.max(
            Math.ceil(reportsData.length / adminReportsLimit),
            1,
          ),
        });
      } else {
        setAdminReports(reportsData.items);
        setAdminReportsMeta({
          total: reportsData.total,
          totalPages: reportsData.totalPages,
        });
      }
      setUsers(usersData);
      const currentStillExists = selectedAdminReportId
        ? (Array.isArray(reportsData) ? reportsData : reportsData.items).some(
            (report) => report.id === selectedAdminReportId,
          )
        : false;
      if (!currentStillExists) {
        setSelectedAdminReportId(null);
        setSelectedAdminReport(null);
      }
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "No se pudo cargar el panel administrativo.",
      );
    }
  }, [adminReportsLimit, adminReportsPage, selectedAdminReportId, token]);

  const openAdminReport = useCallback(
    async (reportId: string) => {
      setSelectedAdminReportId(reportId);
      setAdminDetailLoading(true);
      try {
        const detailData = await api<AdminReportDetail>(
          `/dashboard/reports/${reportId}`,
          token,
        );
        setSelectedAdminReport(detailData);
        setAdminReports((current) =>
          current.map((report) =>
            report.id === detailData.id
              ? {
                  ...report,
                  dominant_emotion:
                    detailData.ai_analysis?.dominant_emotion ??
                    report.dominant_emotion,
                  risk:
                    detailData.psychological_review?.validated_risk ??
                    detailData.ai_analysis?.risk_ai ??
                    report.risk,
                  ai_model_version:
                    detailData.ai_analysis?.model_version ??
                    report.ai_model_version,
                  ai_degraded:
                    detailData.ai_analysis?.relevant_signals.includes(
                      "respaldo local por indisponibilidad de IA",
                    ) ?? report.ai_degraded,
                  summary:
                    detailData.derivation?.non_sensitive_summary ??
                    report.summary,
                }
              : report,
          ),
        );
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "No se pudo abrir el reporte.",
        );
      } finally {
        setAdminDetailLoading(false);
      }
    },
    [token],
  );

  const processPendingAnalysis = async () => {
    setAnalysisProcessing(true);
    setError("");
    try {
      const result = await api<{ claimed: number; completed: number }>(
        "/dashboard/analysis/process-pending",
        token,
        {
          method: "POST",
          body: JSON.stringify({ limit: 25 }),
        },
      );
      await load();
      notify(
        `IA procesada: ${result.completed}/${result.claimed} reportes guardados en BD`,
        "success",
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "No se pudo procesar la IA pendiente.",
      );
    } finally {
      setAnalysisProcessing(false);
    }
  };

  useEffect(() => {
    void load();
  }, [token]);

  useEffect(() => {
    void load();
  }, [adminReportsLimit, adminReportsPage]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void load();
    }, REPORT_REFRESH_MS);

    return () => window.clearInterval(timer);
  }, [load]);

  const createActivity = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedAdminReport) {
      setError(
        "Selecciona un reporte antes de registrar una actividad preventiva.",
      );
      return;
    }
    await api("/preventive-activities", token, {
      method: "POST",
      body: JSON.stringify({
        report_id: selectedAdminReport.id,
        title,
        description: `Actividad vinculada al reporte ${selectedAdminReport.public_code}: ${selectedAdminReport.summary}`,
        objective: `Dar seguimiento preventivo al reporte ${selectedAdminReport.public_code}.`,
        activity_type: "taller",
        responsible: "Convivencia escolar",
        scheduled_date: new Date().toISOString(),
      }),
    });
    setTitle("");
    notify("La actividad preventiva fue registrada.");
    await load();
  };

  const resetUserForm = () => {
    setSelectedUserId(null);
    setUserName("");
    setUserEmail("");
    setUserPassword("Temporal123*");
    setUserRole("PSYCHOLOGIST");
    setUserActive(true);
  };

  const editUser = (user: InternalUserItem) => {
    setSelectedUserId(user.id);
    setUserName(user.name);
    setUserEmail(user.email);
    setUserRole(user.role);
    setUserActive(user.active);
    setUserPassword("Temporal123*");
  };

  const saveUser = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      if (selectedUserId) {
        const current = users.find((user) => user.id === selectedUserId);
        await api(`/users/${selectedUserId}`, token, {
          method: "PATCH",
          body: JSON.stringify({
            name: userName || userEmail.split("@")[0] || "Usuario interno",
            email: userEmail,
            role: userRole,
          }),
        });
        if (current && current.active !== userActive) {
          await api(`/users/${selectedUserId}/status`, token, {
            method: "PATCH",
            body: JSON.stringify({ active: userActive }),
          });
        }
        notify(`Perfil actualizado: ${userEmail}`);
      } else {
        await api("/users", token, {
          method: "POST",
          body: JSON.stringify({
            name: userName || userEmail.split("@")[0] || "Usuario interno",
            email: userEmail,
            password: userPassword,
            role: userRole,
          }),
        });
        setCreatedCredential({
          email: userEmail,
          password: userPassword,
          role: userRole,
        });
        notify(`Perfil creado: ${userEmail}`);
      }
      resetUserForm();
      await load();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "No se pudo guardar el usuario.",
      );
    }
  };

  const statCards = useMemo<Array<[string, unknown]>>(
    () => [
      ["Reportes", summary.reports_received],
      ["Notificaciones", summary.alerts_generated],
      ["Atendidos", summary.cases_addressed],
      ["IA clasificados", summary.ai_classified_reports],
      ["IA con respaldo", summary.ai_degraded_reports],
      ["IA pendiente", summary.ai_pending_reports],
      ["Actividades", summary.preventive_activities],
    ],
    [summary],
  );
  const summaryChartStats = useMemo<MetricMap>(
    () =>
      Object.fromEntries(
        statCards.map(([label, value]) => [label, Number(value ?? 0)]),
      ),
    [statCards],
  );

  const aiPipelineStats = useMemo<MetricMap>(
    () => ({
      Clasificados: Number(summary.ai_classified_reports ?? 0),
      "IA con respaldo": Number(summary.ai_degraded_reports ?? 0),
      "IA pendiente": Number(summary.ai_pending_reports ?? 0),
    }),
    [summary],
  );
  const activityStatusStats = useMemo<MetricMap>(
    () => countMetric(activities, (activity) => reportStatusLabel(activity.status)),
    [activities],
  );
  const filteredAdminReports = useMemo(
    () =>
      adminReports.filter((report) => {
        const reportRisk = normalizeRisk(report.risk);
        const statusMatches =
          adminStatusFilter === "ALL" || report.status === adminStatusFilter;
        const riskMatches =
          adminRiskFilter === "ALL" || reportRisk === adminRiskFilter;
        const aiMatches = matchesAiFilter(report, adminAiFilter);
        const textMatches = includesSearch(
          [
            report.public_code,
            report.status,
            report.dominant_emotion,
            report.summary,
            riskLabel(report.risk),
          ],
          adminSearch,
        );
        return statusMatches && riskMatches && aiMatches && textMatches;
      }),
    [
      adminAiFilter,
      adminReports,
      adminRiskFilter,
      adminSearch,
      adminStatusFilter,
    ],
  );
  const selectedReportActivities = useMemo(
    () =>
      selectedAdminReport
        ? activities.filter(
            (activity) => activity.report_id === selectedAdminReport.id,
          )
        : [],
    [activities, selectedAdminReport],
  );

  return (
    <main className="admin-grid">
      {error && (
        <section className="panel full-row">
          <p className="error">{error}</p>
        </section>
      )}
      <section className="admin-dashboard-top">
        <section className="panel insight-strip admin-hero">
          <div className="section-head">
            <h2>Resumen de reportes</h2>
            <span>{String(summary.reports_received ?? 0)} reportes</span>
          </div>
          <p className="muted">
            Vista estática de volumen, riesgo, emociones y estado IA antes de
            gestionar casos individuales.
          </p>
          <div className="admin-hero-actions">
            <button
              type="button"
              className="ghost-button"
              onClick={processPendingAnalysis}
              disabled={
                analysisProcessing ||
                Number(summary.ai_pending_reports ?? 0) <= 0
              }
            >
              {analysisProcessing
                ? "Procesando IA..."
                : "Procesar IA pendiente"}
            </button>
            <span>{String(summary.ai_pending_reports ?? 0)} pendientes</span>
          </div>
        </section>
        <section className="panel stat-strip">
          {statCards.map(([label, value]) => (
            <div key={label as string}>
              <span>{label}</span>
              <strong>{String(value ?? 0)}</strong>
            </div>
          ))}
        </section>
        <div className="admin-chart-grid">
          <BarChart
            title="Resumen operativo"
            data={summaryChartStats}
            note="Volumen general"
          />
          <BarChart
            title="Estado de IA"
            data={aiPipelineStats}
            note="Procesados, fallback y pendientes"
          />
          <BarChart
            title="Actividad preventiva"
            data={activityStatusStats}
            note="Distribucion operativa"
          />
        </div>
      </section>

      <div className="admin-workbench">
        <div className="admin-report-management">
          <section className="panel admin-report-sidebar">
            <div className="section-head">
              <h2>Reportes anónimos</h2>
              <span>
                {filteredAdminReports.length} de {adminReportsMeta.total} |
                pagina {adminReportsPage} de {adminReportsMeta.totalPages}
              </span>
            </div>
            <div className="filter-bar admin-filter-bar">
              <label>
                Items por pagina
                <select
                  value={adminReportsLimit}
                  onChange={(event) => {
                    setAdminReportsPage(1);
                    setAdminReportsLimit(Number(event.target.value));
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </label>
              <div className="actions">
                <button
                  type="button"
                  disabled={adminReportsPage <= 1}
                  onClick={() =>
                    setAdminReportsPage((value) => Math.max(value - 1, 1))
                  }
                >
                  Anterior
                </button>
                <button
                  type="button"
                  disabled={adminReportsPage >= adminReportsMeta.totalPages}
                  onClick={() => setAdminReportsPage((value) => value + 1)}
                >
                  Siguiente
                </button>
              </div>
            </div>
            <div className="filter-bar admin-filter-bar">
              <label>
                Buscar
                <input
                  value={adminSearch}
                  onChange={(event) => setAdminSearch(event.target.value)}
                  placeholder="Código, grado, resumen o emoción"
                />
              </label>
              <label>
                Riesgo
                <select
                  value={adminRiskFilter}
                  onChange={(event) => setAdminRiskFilter(event.target.value)}
                >
                  <option value="ALL">Todos</option>
                  <option value="LOW">Bajo</option>
                  <option value="MEDIUM">Moderado</option>
                  <option value="HIGH">Alto</option>
                  <option value="SIN_IA">Sin IA</option>
                </select>
              </label>
              <label>
                Estado
                <select
                  value={adminStatusFilter}
                  onChange={(event) => setAdminStatusFilter(event.target.value)}
                >
                  <option value="ALL">Todos</option>
                  <option value="PENDING">Pendiente</option>
                  <option value="IN_REVIEW">En revisión</option>
                  <option value="ADDRESSED">Atendido</option>
                  <option value="CLOSED">Cerrado</option>
                </select>
              </label>
              <label>
                IA
                <select
                  value={adminAiFilter}
                  onChange={(event) => setAdminAiFilter(event.target.value)}
                >
                  <option value="ALL">Todas</option>
                  <option value="PENDING">Pendiente</option>
                  <option value="ANALYZED">Analizada</option>
                  <option value="FALLBACK">Con respaldo</option>
                </select>
              </label>
            </div>
            <div className="table-list report-grid">
              {filteredAdminReports.map((report) => (
                <button
                  type="button"
                  className={`row-button admin-report-row ${riskTone(report.risk)} ${selectedAdminReportId === report.id ? "is-active" : ""}`}
                  key={report.id}
                  onClick={() => openAdminReport(report.id)}
                >
                  <span className="admin-report-line admin-report-line-top">
                    <span>
                      <strong>{report.public_code}</strong>
                      <small>{reportStatusLabel(report.status)}</small>
                    </span>
                    <span className="admin-report-status">
                      <strong className={`risk-chip ${riskTone(report.risk)}`}>
                        {riskLabel(report.risk)}
                      </strong>
                      <small>
                        {reportStatusLabel(report.status)} /{" "}
                        {report.created_at
                          ? new Date(report.created_at).toLocaleDateString(
                              "es-PE",
                            )
                          : "sin fecha"}
                      </small>
                    </span>
                  </span>
                  <span className="admin-report-line admin-report-line-bottom">
                    <small className="admin-report-summary">
                      {report.summary}
                    </small>
                    <span className="report-tags">
                      <span>
                        {report.dominant_emotion ?? "emoción pendiente"}
                      </span>
                      <span>{aiStateLabel(report)}</span>
                      <span>
                        {report.ai_degraded ? "con respaldo" : "normal"}
                      </span>
                    </span>
                  </span>
                </button>
              ))}
              {adminReports.length === 0 && (
                <p className="muted">No hay reportes para mostrar.</p>
              )}
              {adminReports.length > 0 && filteredAdminReports.length === 0 && (
                <p className="muted">
                  No hay reportes que coincidan con los filtros.
                </p>
              )}
            </div>
          </section>

          <section className="panel admin-detail-panel">
            <div className="section-head">
              <h2>Detalle del reporte</h2>
              <span>
                {adminDetailLoading
                  ? "Cargando..."
                  : (selectedAdminReport?.public_code ?? "Sin selección")}
              </span>
            </div>
            {!selectedAdminReport && (
              <p className="muted">
                Selecciona un reporte para ver el detalle completo y decidir una
                acción.
              </p>
            )}
            {selectedAdminReport && (
              <>
                <div className="detail-head">
                  <span>{selectedAdminReport.public_code}</span>
                  <strong
                    className={`risk-chip ${riskTone(selectedAdminReport.risk)}`}
                  >
                    {riskLabel(selectedAdminReport.risk)}
                  </strong>
                </div>
                <div className="detail-meta-grid">
                  <div>
                    <span>Estado</span>
                    <strong>{reportStatusLabel(selectedAdminReport.status)}</strong>
                  </div>
                  <div>
                    <span>Creado</span>
                    <strong>
                      {new Date(selectedAdminReport.created_at).toLocaleString(
                        "es-PE",
                      )}
                    </strong>
                  </div>
                  <div>
                    <span>Actualizado</span>
                    <strong>
                      {new Date(
                        selectedAdminReport.updated_at ??
                          selectedAdminReport.created_at,
                      ).toLocaleString("es-PE")}
                    </strong>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Datos reservados</h3>
                  <p className="muted">
                    La informacion sensible completa queda reservada para
                    psicologia autorizada. Este panel muestra solo el resumen
                    seguro y la trazabilidad operativa.
                  </p>
                </div>

                <div className="detail-section">
                  <h3>Lectura IA</h3>
                  {selectedAdminReport.ai_analysis ? (
                    <>
                      <div
                        className={`ai-summary ${riskTone(selectedAdminReport.ai_analysis.risk_ai)}`}
                      >
                        <p className="ai-summary-title">
                          La IA ve este caso como{" "}
                          {riskLabel(
                            selectedAdminReport.ai_analysis.risk_ai,
                          ).toLowerCase()}
                          .
                        </p>
                        <p className="ai-summary-body">
                          {selectedAdminReport.ai_analysis.context_summary ??
                            describeRiskNarrative(
                              selectedAdminReport.ai_analysis.risk_ai,
                              selectedAdminReport.ai_analysis.dominant_emotion,
                            )}
                        </p>
                        <p className="ai-decision">
                          {explainAiDecision(selectedAdminReport.ai_analysis)}
                        </p>
                        <div className="ai-summary-meta">
                          <span>
                            Emoción dominante:{" "}
                            {selectedAdminReport.ai_analysis.dominant_emotion}
                          </span>
                          <span>
                            Confianza:{" "}
                            {confidenceLabel(
                              selectedAdminReport.ai_analysis.confidence,
                            )}
                          </span>
                          <span>
                            Accion sugerida:{" "}
                            {selectedAdminReport.ai_analysis
                              .recommended_action ??
                              buildActionHint(
                                selectedAdminReport.ai_analysis.risk_ai,
                              )}
                          </span>
                        </div>
                      </div>
                      <div className="emotion-grid">
                        {sortMetricEntries(
                          selectedAdminReport.ai_analysis.emotion_scores,
                        ).map(([emotion, value]) => (
                          <div className="emotion-row" key={emotion}>
                            <div className="emotion-head">
                              <span>{translateMetricLabel(emotion)}</span>
                              <strong>{Math.round(toPercent(value))}%</strong>
                            </div>
                            <div className="emotion-track">
                              <div
                                className="emotion-fill"
                                style={{
                                  width: `${Math.max(6, toPercent(value))}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="signal-list">
                        {selectedAdminReport.ai_analysis.relevant_signals.map(
                          (signal) => (
                            <span key={signal}>{signal}</span>
                          ),
                        )}
                      </div>
                      <p className="muted">
                        {selectedAdminReport.ai_analysis.note}
                      </p>
                    </>
                  ) : (
                    <p className="muted">
                      La IA todavía no produjo una lectura para este reporte.
                    </p>
                  )}
                </div>

                <div className="detail-section">
                  <h3>Revisión y derivación</h3>
                  <div className="detail-meta-grid">
                    <div>
                      <span>Cola IA</span>
                      <strong>
                        {selectedAdminReport.analysis_queue.status}
                      </strong>
                    </div>
                    <div>
                      <span>Intentos</span>
                      <strong>
                        {selectedAdminReport.analysis_queue.attempts}
                      </strong>
                    </div>
                    <div>
                      <span>Próximo intento</span>
                      <strong>
                        {selectedAdminReport.analysis_queue.next_attempt_at ??
                          "Sin dato"}
                      </strong>
                    </div>
                    <div>
                      <span>Último error</span>
                      <strong>
                        {selectedAdminReport.analysis_queue.last_error ??
                          "Sin error"}
                      </strong>
                    </div>
                  </div>
                  {selectedAdminReport.psychological_review ? (
                    <div className="detail-meta-grid">
                      <div>
                        <span>Riesgo validado</span>
                        <strong>
                          {riskLabel(
                            selectedAdminReport.psychological_review
                              .validated_risk,
                          )}
                        </strong>
                      </div>
                      <div>
                        <span>Revisado</span>
                        <strong>
                          {new Date(
                            selectedAdminReport.psychological_review
                              .reviewed_at,
                          ).toLocaleString("es-PE")}
                        </strong>
                      </div>
                      <div className="full-span">
                        <span>Observación</span>
                        <strong>
                          {selectedAdminReport.psychological_review
                            .observation_internal ?? "Sin observación"}
                        </strong>
                      </div>
                    </div>
                  ) : (
                    <p className="muted">
                      Aún no hay revisión psicológica guardada.
                    </p>
                  )}
                  {selectedAdminReport.derivation ? (
                    <div className="detail-meta-grid">
                      <div>
                        <span>Estado derivación</span>
                        <strong>
                          {reportStatusLabel(
                            selectedAdminReport.derivation.status,
                          )}
                        </strong>
                      </div>
                      <div>
                        <span>Derivado</span>
                        <strong>
                          {new Date(
                            selectedAdminReport.derivation.created_at,
                          ).toLocaleString("es-PE")}
                        </strong>
                      </div>
                      <div className="full-span">
                        <span>Resumen no sensible</span>
                        <strong>
                          {selectedAdminReport.derivation.non_sensitive_summary}
                        </strong>
                      </div>
                    </div>
                  ) : (
                    <p className="muted">
                      Este reporte todavía no fue enviado al director.
                    </p>
                  )}
                </div>
              </>
            )}
          </section>

          <section className="panel report-activity-panel">
            <div className="section-head">
              <h2>Actividad preventiva del reporte</h2>
              <span>{selectedAdminReport?.public_code ?? "Sin selección"}</span>
            </div>
            <form className="inline-form" onSubmit={createActivity}>
              <label>
                Titulo
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Taller, seguimiento o intervención preventiva"
                  required
                />
              </label>
              <button disabled={!selectedAdminReport}>
                Registrar actividad
              </button>
            </form>
            <div className="table-list compact-list">
              {selectedReportActivities.map((activity) => (
                <div className="list-row" key={activity.id}>
                  <span>
                    <strong>{activity.title}</strong>
                    <small>
                      {new Date(activity.scheduled_date).toLocaleDateString(
                        "es-PE",
                      )}
                    </small>
                  </span>
                  <strong>{reportStatusLabel(activity.status)}</strong>
                </div>
              ))}
              {selectedAdminReport && selectedReportActivities.length === 0 && (
                <p className="muted">
                  No hay actividades preventivas vinculadas a este reporte.
                </p>
              )}
              {!selectedAdminReport && (
                <p className="muted">
                  Selecciona un reporte para crear o ver sus actividades
                  preventivas.
                </p>
              )}
            </div>
          </section>
        </div>

        <aside className="admin-secondary-actions">
          <section className="panel user-control-panel">
            <div className="section-head">
              <h2>Control de usuarios</h2>
              {selectedUserId && (
                <button
                  type="button"
                  className="ghost-button"
                  onClick={resetUserForm}
                >
                  Nuevo
                </button>
              )}
            </div>
            <p className="muted">
              {selectedUserId
                ? "Actualiza el perfil seleccionado."
                : "Crea perfiles internos como acción secundaria."}
            </p>
            <form className="inline-form" onSubmit={saveUser}>
              <label>
                Nombre
                <input
                  value={userName}
                  onChange={(event) => setUserName(event.target.value)}
                  required
                />
              </label>
              <label>
                Correo
                <input
                  value={userEmail}
                  onChange={(event) => setUserEmail(event.target.value)}
                  type="email"
                  required
                />
              </label>
              {!selectedUserId && (
                <label>
                  Contraseña
                  <input
                    value={userPassword}
                    onChange={(event) => setUserPassword(event.target.value)}
                    type="text"
                    required
                  />
                </label>
              )}
              <label>
                Rol
                <select
                  value={userRole}
                  onChange={(event) => setUserRole(event.target.value)}
                >
                  <option value="PSYCHOLOGIST">Psicólogo</option>
                  <option value="ADMIN_DIRECTOR">Administrador/Director</option>
                </select>
              </label>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={userActive}
                  onChange={(event) => setUserActive(event.target.checked)}
                />
                Perfil activo
              </label>
              <button>
                {selectedUserId ? "Actualizar usuario" : "Crear usuario"}
              </button>
              {createdCredential && (
                <div className="error credential-box">
                  Perfil creado: <strong>{createdCredential.email}</strong> /{" "}
                  <strong>{createdCredential.password}</strong>
                  <br />
                  Rol: {roleLabel(createdCredential.role)}
                </div>
              )}
            </form>
          </section>

          <section className="panel user-list-panel">
            <div className="section-head">
              <h2>Perfiles internos</h2>
              <span>{users.length} total</span>
            </div>
            <div className="table-list compact-list">
              {users.map((user) => (
                <button
                  type="button"
                  className={`row-button user-row ${selectedUserId === user.id ? "is-active" : ""}`}
                  key={user.id}
                  onClick={() => editUser(user)}
                >
                  <span className="user-identity">
                    <span className="user-avatar">
                      {user.name.trim().slice(0, 1).toUpperCase() || "U"}
                    </span>
                    <span className="user-copy">
                      <strong>{user.name}</strong>
                      <small>{user.email}</small>
                    </span>
                  </span>
                  <span className="user-meta">
                    <strong>{roleLabel(user.role)}</strong>
                    <small
                      className={`status-pill ${user.active ? "is-on" : "is-off"}`}
                    >
                      {user.active ? "Activo" : "Inactivo"}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
