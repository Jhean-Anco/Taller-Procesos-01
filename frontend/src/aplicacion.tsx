import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';
const REPORT_REFRESH_MS = Number(import.meta.env.VITE_REPORT_REFRESH_MS ?? 10000);
const ORIENTATION =
  'Tu reporte fue enviado de manera anónima. Será revisado por el personal autorizado. Si te encuentras en peligro inmediato, acude a un adulto de confianza o al área responsable de convivencia escolar.';

type Role = 'PSYCHOLOGIST' | 'ADMIN_DIRECTOR' | 'psicologo' | 'admin';

interface Session {
  accessToken: string;
  usuario: { id: string; nombre: string; correo: string; rol: Role };
}

interface ReportListItem {
  id: string;
  public_code: string;
  grade_reference?: string | null;
  section_reference?: string | null;
  age_range?: string | null;
  status: string;
  dominant_emotion?: string | null;
  risk_ai?: string | null;
  ai_model_version?: string | null;
  ai_degraded?: boolean;
  validated_risk?: string | null;
  priority_risk?: string | null;
  created_at: string;
  updated_at?: string;
}

interface ReportDetail extends ReportListItem {
  emotional_form: Record<string, unknown>;
  message_text: string;
  ai_analysis?: {
    dominant_emotion: string;
    emotion_scores: Record<string, number>;
    risk_ai: string;
    confidence?: number | null;
    relevant_signals: string[];
    note: string;
    model_version?: string | null;
  } | null;
}

interface AlertItem {
  id: string;
  report_id: string;
  risk_level: string;
  status: string;
  generated_by: string;
  created_at: string;
}

interface AdminReportItem {
  id: string;
  public_code: string;
  grade_reference?: string | null;
  section_reference?: string | null;
  status: string;
  dominant_emotion?: string | null;
  risk?: string | null;
  ai_model_version?: string | null;
  ai_degraded?: boolean;
  summary: string;
  created_at: string;
  updated_at?: string;
}

interface AdminReportDetail extends AdminReportItem {
  age_range?: string | null;
  message_text: string;
  emotional_form: Record<string, unknown>;
  ai_analysis?: {
    dominant_emotion: string;
    emotion_scores: Record<string, number>;
    risk_ai: string;
    confidence?: number | null;
    relevant_signals: string[];
    note: string;
    model_version?: string | null;
  } | null;
  psychological_review?: {
    validated_risk: string;
    observation_internal?: string | null;
    reviewed_at: string;
  } | null;
  derivation?: {
    non_sensitive_summary: string;
    status: string;
    created_at: string;
    admin_director_id?: string | null;
  } | null;
  analysis_queue: {
    status: string;
    attempts: number;
    next_attempt_at?: string | null;
    last_error?: string | null;
    requested_at?: string | null;
  };
}

type MetricMap = Record<string, number | string>;

type RiskTier = 'LOW' | 'MEDIUM' | 'HIGH' | 'SIN_IA';
type ReportStatusCode = 'PENDING' | 'IN_REVIEW' | 'ADDRESSED' | 'CLOSED' | string;
type ToastKind = 'success' | 'warning' | 'error';

async function api<T>(path: string, token?: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
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
  return typeof value === 'number' && Number.isFinite(value);
}

function normalizeRisk(value?: string | null): RiskTier {
  const upper = value?.toUpperCase();
  if (upper === 'LOW' || upper === 'MEDIUM' || upper === 'HIGH') {
    return upper;
  }
  return 'SIN_IA';
}

function riskLabel(value?: string | null) {
  const labels: Record<RiskTier, string> = {
    LOW: 'Bajo',
    MEDIUM: 'Moderado',
    HIGH: 'Alto',
    SIN_IA: 'Sin IA',
  };

  return labels[normalizeRisk(value)];
}

function reportStatusLabel(value?: ReportStatusCode | null) {
  const status = (value ?? '').toUpperCase();
  const labels: Record<string, string> = {
    PENDING: 'Pendiente',
    IN_REVIEW: 'En revisión',
    ADDRESSED: 'Atendido',
    CLOSED: 'Cerrado',
  };
  return labels[status] ?? value ?? 'Sin estado';
}

function riskTone(value?: string | null) {
  const risk = normalizeRisk(value);
  if (risk === 'HIGH') return 'tone-high';
  if (risk === 'MEDIUM') return 'tone-medium';
  if (risk === 'LOW') return 'tone-low';
  return 'tone-pending';
}

function confidenceLabel(value?: number | null) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'sin dato';
  const score = value <= 1 ? value * 100 : value;
  if (score >= 80) return `alta confianza (${Math.round(score)}%)`;
  if (score >= 55) return `confianza media (${Math.round(score)}%)`;
  return `confianza baja (${Math.round(score)}%)`;
}

function aiStateLabel(report?: { ai_model_version?: string | null; ai_degraded?: boolean } | null) {
  if (!report?.ai_model_version) return 'IA pendiente';
  return report.ai_degraded ? 'IA con respaldo local' : 'IA analizada';
}

function roleLabel(value: string) {
  return value === 'ADMIN_DIRECTOR' ? 'Administrador/Director' : 'Psicólogo';
}

function toastTitle(kind: ToastKind) {
  if (kind === 'error') return 'Error';
  if (kind === 'warning') return 'Aviso';
  return 'Listo';
}

function toPercent(value: number) {
  return value <= 1 ? value * 100 : value;
}

function sortMetricEntries(data: Record<string, number>) {
  return Object.entries(data).sort((a, b) => b[1] - a[1]);
}

function describeRiskNarrative(level?: string | null, emotion?: string | null) {
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

function buildActionHint(level?: string | null) {
  const risk = normalizeRisk(level);
  if (risk === 'HIGH') return 'Abrir seguimiento y priorizar contacto presencial.';
  if (risk === 'MEDIUM') return 'Revisar contexto, registrar observacion y programar seguimiento.';
  if (risk === 'LOW') return 'Monitorear y mantener registro preventivo.';
  return 'Esperar la clasificacion automatica.';
}

function humanizeKey(key: string) {
  return key
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function translateMetricLabel(label: string) {
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
  };

  return labels[normalized] ?? humanizeKey(label);
}

function formatDetailValue(value: unknown) {
  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No';
  }
  if (value === null || value === undefined || value === '') {
    return 'Sin dato';
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
  const numericEntries = entries.filter(([, value]) => isNumericMetric(value)) as Array<[string, number]>;
  const maxValue = numericEntries.reduce((max, [, value]) => Math.max(max, value), 0);

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
                  style={{ width: `${maxValue === 0 ? 0 : Math.max(6, (value / maxValue) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="muted">No hay datos numéricos suficientes para graficar.</p>
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
    const raw = localStorage.getItem('safeschool_session');
    return raw ? (JSON.parse(raw) as Session) : null;
  });
  const [screen, setScreen] = useState<'public' | 'login' | 'psychologist' | 'admin'>('public');
  const [toasts, setToasts] = useState<Array<{ id: string; kind: ToastKind; message: string }>>([]);

  useEffect(() => {
    if (!session) return;
    localStorage.setItem('safeschool_session', JSON.stringify(session));
    const isAdmin = session.usuario.rol === 'ADMIN_DIRECTOR' || session.usuario.rol === 'admin';
    setScreen(isAdmin ? 'admin' : 'psychologist');
  }, [session]);

  const logout = () => {
    localStorage.removeItem('safeschool_session');
    setSession(null);
    setScreen('public');
  };

  const notify = (message: string, kind: ToastKind = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((current) => [...current, { id, kind, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-copy">
          <p className="eyebrow">SafeSchool AI</p>
          <h1>Seguimiento de convivencia escolar</h1>
          <p className="muted">Seguimiento anónimo, lectura IA y revisión psicológica con foco operativo.</p>
        </div>
        <nav>
          {!session && (
            <button onClick={() => setScreen(screen === 'login' ? 'public' : 'login')}>
              {screen === 'login' ? 'Reporte anónimo' : 'Acceso interno'}
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

      {screen === 'public' && <PublicReport />}
      {screen === 'login' && <Login onLogin={setSession} />}
      {session && screen === 'psychologist' && (
        <PsychologistPanel token={session.accessToken} notify={notify} />
      )}
      {session && screen === 'admin' && <AdminPanel token={session.accessToken} notify={notify} />}
    </div>
  );
}

function PublicReport() {
  const [message, setMessage] = useState('');
  const [grade, setGrade] = useState('secundaria-3');
  const [section, setSection] = useState('A');
  const [ageRange, setAgeRange] = useState('12-14');
  const [form, setForm] = useState({
    fear: false,
    sadness: false,
    anxiety: false,
    isolation: false,
    school_insecurity: false,
  });
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ public_code: string; orientation: string } | null>(null);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (!consent) {
      setError('Debes aceptar el aviso informativo antes de enviar.');
      return;
    }
    if (!window.confirm('¿Enviar este reporte anónimo para revisión autorizada?')) return;
    setLoading(true);
    try {
      const response = await api<{ public_code: string; orientation: string }>('/anonymous-reports', undefined, {
        method: 'POST',
        body: JSON.stringify({
          grade_reference: grade,
          section_reference: section,
          age_range: ageRange,
          emotional_form: form,
          message_text: message,
          consent_accepted: consent,
        }),
      });
      setResult(response);
      setMessage('');
      setConsent(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo enviar el reporte.');
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
        <div>
          <p className="eyebrow">Canal anónimo</p>
          <h2>Cuentanos que esta pasando</h2>
          <p className="muted">
            No escribas nombres, DNI, telefonos, correos ni direcciones. El reporte se usa solo con fines preventivos.
          </p>
        </div>

        <div className="field-grid">
          <label>
            Grado referencial
            <select value={grade} onChange={(event) => setGrade(event.target.value)}>
              <option value="primaria-5">Primaria 5</option>
              <option value="primaria-6">Primaria 6</option>
              <option value="secundaria-1">Secundaria 1</option>
              <option value="secundaria-2">Secundaria 2</option>
              <option value="secundaria-3">Secundaria 3</option>
              <option value="secundaria-4">Secundaria 4</option>
              <option value="secundaria-5">Secundaria 5</option>
            </select>
          </label>
          <label>
            Seccion referencial
            <select value={section} onChange={(event) => setSection(event.target.value)}>
              <option>A</option>
              <option>B</option>
              <option>C</option>
            </select>
          </label>
          <label>
            Rango de edad
            <select value={ageRange} onChange={(event) => setAgeRange(event.target.value)}>
              <option value="9-11">9-11</option>
              <option value="12-14">12-14</option>
              <option value="15-17">15-17</option>
            </select>
          </label>
        </div>

        <div className="check-grid">
          {[
            ['fear', 'Miedo'],
            ['sadness', 'Tristeza'],
            ['anxiety', 'Ansiedad'],
            ['isolation', 'Aislamiento'],
            ['school_insecurity', 'Inseguridad escolar'],
          ].map(([key, label]) => (
            <label key={key} className="check-row">
              <input
                type="checkbox"
                checked={form[key as keyof typeof form]}
                onChange={(event) =>
                  setForm((current) => ({ ...current, [key]: event.target.checked }))
                }
              />
              {label}
            </label>
          ))}
        </div>

        <label>
          Mensaje anónimo
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            minLength={10}
            maxLength={4000}
            required
            placeholder="Describe como te sientes o que situacion quieres reportar sin identificar personas."
          />
        </label>

        <label className="consent">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
          />
          Acepto que mi reporte anónimo sea revisado por personal autorizado con fines preventivos.
        </label>

        {error && <p className="error">{error}</p>}
        <button disabled={loading || message.trim().length < 10}>
          {loading ? 'Enviando...' : 'Enviar reporte anónimo'}
        </button>
      </form>
    </main>
  );
}

function Login({ onLogin }: { onLogin: (session: Session) => void }) {
  const [email, setEmail] = useState('psicologo@agora.edu.pe');
  const [password, setPassword] = useState('psicolog2024');
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const session = await api<Session>('/auth/login', undefined, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      onLogin(session);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Credenciales invalidas');
    }
  };

  return (
    <main className="narrow">
      <form className="panel auth-panel" onSubmit={submit}>
        <p className="eyebrow">Acceso interno</p>
        <h2>Ingreso de personal autorizado</h2>
        <p className="muted">
          Psicólogo y administrador acceden desde aquí para revisar reportes, seguimiento e indicadores IA.
        </p>
        <label>
          Correo
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
        </label>
        <label>
          Contrasena
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
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
  const [risk, setRisk] = useState('LOW');
  const [observation, setObservation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const open = useCallback(async (id: string) => {
    setError('');
    try {
      const response = await api<ReportDetail>(`/psychologist/reports/${id}`, token);
      setDetail(response);
      setRisk(response.validated_risk ?? response.risk_ai ?? 'LOW');
      setReports((current) =>
        current.map((report) =>
          report.id === response.id
            ? {
                ...report,
                dominant_emotion: response.ai_analysis?.dominant_emotion ?? report.dominant_emotion,
                risk_ai: response.ai_analysis?.risk_ai ?? report.risk_ai,
                ai_model_version: response.ai_analysis?.model_version ?? report.ai_model_version,
                ai_degraded:
                  response.ai_analysis?.relevant_signals.includes(
                    'respaldo local por indisponibilidad de IA',
                  ) ?? report.ai_degraded,
                priority_risk:
                  response.validated_risk ?? response.ai_analysis?.risk_ai ?? report.priority_risk,
              }
            : report,
        ),
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo abrir el reporte.');
    }
  }, [token]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const reportsData = await api<ReportListItem[]>('/psychologist/reports', token);
      setReports(reportsData);

      const currentStillExists = detail ? reportsData.some((report) => report.id === detail.id) : false;
      const target = currentStillExists ? detail?.id : reportsData[0]?.id;
      if (target) {
        await open(target);
      } else {
        setDetail(null);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudieron cargar los reportes.');
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
      method: 'POST',
      body: JSON.stringify({ validated_risk: risk, observation_internal: observation }),
    });
    setObservation('');
    notify('La revisión fue guardada.');
    await open(detail.id);
    await load();
  };

  const sendToDirector = async () => {
    if (!detail) return;
    await api(`/psychologist/reports/${detail.id}/derive`, token, {
      method: 'POST',
      body: JSON.stringify({}),
    });
    notify('El reporte fue enviado al director.', 'success');
    await open(detail.id);
    await load();
  };

  const remove = async () => {
    if (!detail) return;
    if (!window.confirm('¿Eliminar este reporte anónimo?')) return;
    await api(`/psychologist/reports/${detail.id}`, token, {
      method: 'DELETE',
    });
    notify('El reporte fue eliminado.', 'warning');
    setDetail(null);
    await load();
  };

  const detailAnalysis = detail?.ai_analysis ?? null;
  const reportInsights = useMemo(() => {
    const total = reports.length;
    const highRisk = reports.filter((report) => normalizeRisk(report.priority_risk ?? report.validated_risk ?? report.risk_ai) === 'HIGH').length;
    const fallback = reports.filter((report) => report.ai_degraded).length;
    const pending = reports.filter((report) => !report.ai_model_version).length;
    return {
      total,
      highRisk,
      fallback,
      pending,
      analyzed: total - pending,
    };
  }, [reports]);
  const detailEmotionEntries = useMemo(
    () =>
      detailAnalysis
        ? sortMetricEntries(detailAnalysis.emotion_scores)
            .slice(0, 5)
            .map(([emotion, value]) => [translateMetricLabel(emotion), toPercent(value)] as const)
        : [],
    [detailAnalysis],
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
          La columna de la izquierda prioriza urgencia. El panel central traduce la señal IA a criterios de seguimiento.
        </p>
      </section>

      <section className="panel list-panel">
        <div className="section-head">
          <h2>Reportes anónimos</h2>
          <span>{reports.length} total</span>
        </div>
        {loading && <p className="muted">Cargando reportes...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && reports.length === 0 && <p className="muted">No hay reportes registrados.</p>}
        <div className="table-list report-stack">
          {reports.map((report) => (
            <button
              key={report.id}
              type="button"
              className={`row-button report-row ${detail?.id === report.id ? 'is-active' : ''}`}
              onClick={() => open(report.id)}
            >
              <span className="report-row-main">
                <strong>{report.public_code}</strong>
                <small>
                  {report.grade_reference ?? 'sin grado'} / {report.section_reference ?? 'sin sección'}
                </small>
                <small>
                  {report.age_range ?? 'sin edad'} / {reportStatusLabel(report.status)}
                </small>
                <small>
                  {new Date(report.created_at).toLocaleDateString('es-PE')} /{' '}
                  {report.dominant_emotion ?? 'sin emoción'}
                </small>
                <span className="report-tags">
                  <span>{riskLabel(report.priority_risk ?? report.validated_risk ?? report.risk_ai)}</span>
                  <span>{aiStateLabel(report)}</span>
                  <span>{report.status === 'PENDING' ? 'Pendiente de revisión' : 'Con seguimiento'}</span>
                </span>
              </span>
              <span className="ai-stack">
                <strong className={`risk-chip ${riskTone(report.priority_risk ?? report.validated_risk ?? report.risk_ai)}`}>
                  {riskLabel(report.priority_risk ?? report.validated_risk ?? report.risk_ai)}
                </strong>
                <small>{report.dominant_emotion ?? 'emocion pendiente'}</small>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel detail-panel">
        <h2>Revision psicologica</h2>
        {!detail && <p className="muted">Selecciona un reporte para revisar contenido anónimo y análisis local.</p>}
        {detail && (
          <>
            <div className="detail-head">
              <span>{detail.public_code}</span>
              <strong className={`risk-chip ${riskTone(detail.priority_risk ?? detail.validated_risk ?? detail.risk_ai)}`}>
                {riskLabel(detail.priority_risk ?? detail.validated_risk ?? detail.risk_ai)}
              </strong>
            </div>
            <p className="message-box">{detail.message_text}</p>
            <div className="detail-meta-grid">
              <div>
                <span>Grado</span>
                <strong>{detail.grade_reference ?? 'sin grado'}</strong>
              </div>
              <div>
                <span>Sección</span>
                <strong>{detail.section_reference ?? 'sin sección'}</strong>
              </div>
              <div>
                <span>Edad</span>
                <strong>{detail.age_range ?? 'sin dato'}</strong>
              </div>
              <div>
                <span>Estado</span>
                <strong>{reportStatusLabel(detail.status)}</strong>
              </div>
              <div>
                <span>Creado</span>
                <strong>{new Date(detail.created_at).toLocaleString('es-PE')}</strong>
              </div>
              <div>
                <span>Actualizado</span>
                <strong>{new Date(detail.updated_at ?? detail.created_at).toLocaleString('es-PE')}</strong>
              </div>
            </div>
            <div className="ai-panel">
              <div className="section-head">
                <h3>Revision IA</h3>
                <span>{aiStateLabel(detail)}</span>
              </div>
              {detailAnalysis ? (
                <>
                  <div className={`ai-summary ${riskTone(detailAnalysis.risk_ai)}`}>
                    <p className="ai-summary-title">La IA ve este caso como {riskLabel(detailAnalysis.risk_ai).toLowerCase()}.</p>
                    <p className="ai-summary-body">{describeRiskNarrative(detailAnalysis.risk_ai, detailAnalysis.dominant_emotion)}</p>
                    <div className="ai-summary-meta">
                      <span>Emocion dominante: {detailAnalysis.dominant_emotion}</span>
                      <span>Confianza: {confidenceLabel(detailAnalysis.confidence)}</span>
                      <span>Accion sugerida: {buildActionHint(detailAnalysis.risk_ai)}</span>
                    </div>
                  </div>
                  <div className="signal-list">
                    {detailAnalysis.relevant_signals.length > 0 ? (
                      detailAnalysis.relevant_signals.map((signal) => <span key={signal}>{signal}</span>)
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
                            <div className="emotion-fill" style={{ width: `${Math.max(6, value)}%` }} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="muted">No hay distribucion emocional para mostrar.</p>
                    )}
                  </div>
                </>
              ) : (
                <p className="error">La clasificacion IA aun no esta disponible para este reporte.</p>
              )}
            </div>
            <label>
              Riesgo validado
              <select value={risk} onChange={(event) => setRisk(event.target.value)}>
                <option value="LOW">Bajo</option>
                <option value="MEDIUM">Moderado</option>
                <option value="HIGH">Alto</option>
              </select>
            </label>
            <label>
              Observacion interna
              <textarea value={observation} onChange={(event) => setObservation(event.target.value)} />
            </label>
            <div className="actions">
              <button type="button" onClick={review}>Guardar revisión</button>
              <button type="button" onClick={sendToDirector}>Enviar al director</button>
              <button type="button" className="ghost-button" onClick={remove}>Eliminar</button>
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
  const [riskStats, setRiskStats] = useState<MetricMap>({});
  const [emotionStats, setEmotionStats] = useState<MetricMap>({});
  const [trendStats, setTrendStats] = useState<MetricMap>({});
  const [gradeStats, setGradeStats] = useState<MetricMap>({});
  const [activities, setActivities] = useState<Array<Record<string, string>>>([]);
  const [adminReports, setAdminReports] = useState<AdminReportItem[]>([]);
  const [selectedAdminReportId, setSelectedAdminReportId] = useState<string | null>(null);
  const [selectedAdminReport, setSelectedAdminReport] = useState<AdminReportDetail | null>(null);
  const [adminDetailLoading, setAdminDetailLoading] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('Temporal123*');
  const [userRole, setUserRole] = useState('PSYCHOLOGIST');
  const [createdCredential, setCreatedCredential] = useState<{ email: string; password: string; role: string } | null>(null);

  const load = useCallback(async () => {
    setError('');
    try {
      const [summaryData, riskData, emotionData, trendData, gradeData, activityData, reportsData] = await Promise.all([
        api<Record<string, unknown>>('/dashboard/summary', token),
        api<MetricMap>('/dashboard/risk-statistics', token),
        api<MetricMap>('/dashboard/emotion-statistics', token),
        api<MetricMap>('/dashboard/anonymous-reports-trends', token),
        api<MetricMap>('/dashboard/grade-statistics', token),
        api<Array<Record<string, string>>>('/preventive-activities', token),
        api<AdminReportItem[]>('/dashboard/reports', token),
      ]);
      setSummary(summaryData);
      setRiskStats(riskData);
      setEmotionStats(emotionData);
      setTrendStats(trendData);
      setGradeStats(gradeData);
      setActivities(activityData);
      setAdminReports(reportsData);
      const nextId =
        (selectedAdminReportId && reportsData.some((report) => report.id === selectedAdminReportId)
          ? selectedAdminReportId
          : reportsData[0]?.id) ?? null;
      setSelectedAdminReportId(nextId);
      if (nextId) {
        await openAdminReport(nextId);
      } else {
        setSelectedAdminReport(null);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo cargar el panel administrativo.');
    }
  }, [selectedAdminReportId, token]);

  const openAdminReport = useCallback(async (reportId: string) => {
    setSelectedAdminReportId(reportId);
    setAdminDetailLoading(true);
    try {
      const detailData = await api<AdminReportDetail>(`/dashboard/reports/${reportId}`, token);
      setSelectedAdminReport(detailData);
      setAdminReports((current) =>
        current.map((report) =>
          report.id === detailData.id
            ? {
                ...report,
                dominant_emotion:
                  detailData.ai_analysis?.dominant_emotion ?? report.dominant_emotion,
                risk: detailData.psychological_review?.validated_risk ?? detailData.ai_analysis?.risk_ai ?? report.risk,
                ai_model_version: detailData.ai_analysis?.model_version ?? report.ai_model_version,
                ai_degraded:
                  detailData.ai_analysis?.relevant_signals.includes(
                    'respaldo local por indisponibilidad de IA',
                  ) ?? report.ai_degraded,
                summary: detailData.derivation?.non_sensitive_summary ?? report.summary,
              }
            : report,
        ),
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo abrir el reporte.');
    } finally {
      setAdminDetailLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [token]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void load();
    }, REPORT_REFRESH_MS);

    return () => window.clearInterval(timer);
  }, [load]);

  const createActivity = async (event: FormEvent) => {
    event.preventDefault();
    await api('/preventive-activities', token, {
      method: 'POST',
      body: JSON.stringify({
        title,
        description: 'Actividad preventiva institucional basada en tendencias agregadas.',
        objective: 'Reducir senales de riesgo y mejorar convivencia.',
        activity_type: 'taller',
        responsible: 'Convivencia escolar',
        scheduled_date: new Date().toISOString(),
      }),
    });
    setTitle('');
    notify('La actividad preventiva fue registrada.');
    await load();
  };

  const createUser = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await api('/users', token, {
        method: 'POST',
        body: JSON.stringify({
          name: userEmail.split('@')[0] || 'Usuario interno',
          email: userEmail,
          password: userPassword,
          role: userRole,
        }),
      });
      setCreatedCredential({ email: userEmail, password: userPassword, role: userRole });
      setUserEmail('');
      setUserPassword('Temporal123*');
      notify(`Perfil creado: ${userEmail}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo crear el usuario.');
    }
  };

  const statCards = useMemo<Array<[string, unknown]>>(
    () => [
      ['Reportes', summary.reports_received],
      ['Notificaciones', summary.alerts_generated],
      ['Atendidos', summary.cases_addressed],
      ['IA clasificados', summary.ai_classified_reports],
      ['IA con respaldo', summary.ai_degraded_reports],
      ['IA pendiente', summary.ai_pending_reports],
      ['Actividades', summary.preventive_activities],
    ],
    [summary],
  );

  const aiPipelineStats = useMemo<MetricMap>(
    () => ({
      Clasificados: Number(summary.ai_classified_reports ?? 0),
      'IA con respaldo': Number(summary.ai_degraded_reports ?? 0),
      'IA pendiente': Number(summary.ai_pending_reports ?? 0),
    }),
    [summary],
  );

  return (
    <main className="admin-grid">
      {error && (
        <section className="panel full-row">
          <p className="error">{error}</p>
        </section>
      )}
      <section className="panel full-row insight-strip admin-hero">
        <div className="section-head">
          <h2>IA y carga operativa</h2>
          <span>{String(summary.reports_received ?? 0)} reportes</span>
        </div>
        <p className="muted">
          La vista prioriza volumen, riesgo y estado de la IA para ver el comportamiento del sistema bajo estrés.
        </p>
      </section>
      <section className="panel stat-strip">
        {statCards.map(([label, value]) => (
          <div key={label as string}>
            <span>{label}</span>
            <strong>{String(value ?? 0)}</strong>
          </div>
        ))}
      </section>

      <BarChart title="Estado de IA" data={aiPipelineStats} note="Procesados, fallback y pendientes" />
      <BarChart title="Riesgo IA y validado" data={riskStats} note="Distribucion del riesgo" />
      <BarChart title="Dominio emocional" data={emotionStats} note="Distribucion emocional" />
      <BarChart title="Carga por dia" data={trendStats} note="Serie temporal" />
      <BarChart title="Carga por grado" data={gradeStats} note="Distribucion por grado" />

      <section className="panel full-row">
        <div className="section-head">
          <h2>Reportes anónimos</h2>
          <span>{adminReports.length} total</span>
        </div>
        <div className="table-list report-grid">
          {adminReports.map((report) => (
            <button
              type="button"
              className={`row-button admin-report-row ${selectedAdminReportId === report.id ? 'is-active' : ''}`}
              key={report.id}
              onClick={() => openAdminReport(report.id)}
            >
              <span className="report-row-main">
                <strong>{report.public_code}</strong>
                <small>
                  {report.grade_reference ?? 'sin grado'} / {report.section_reference ?? 'sin sección'}
                </small>
                <small>
                  {reportStatusLabel(report.status)} /{' '}
                  {report.created_at ? new Date(report.created_at).toLocaleDateString('es-PE') : 'sin fecha'}
                </small>
                <small className="admin-report-summary">{report.summary}</small>
              </span>
              <span className="ai-stack">
                <strong className={`risk-chip ${riskTone(report.risk)}`}>{riskLabel(report.risk)}</strong>
                <small>{report.dominant_emotion ?? 'emoción pendiente'}</small>
              </span>
              <span className="report-tags">
                <span>{aiStateLabel(report)}</span>
                <span>{report.ai_model_version ?? 'sin modelo'}</span>
                <span>{report.ai_degraded ? 'con respaldo' : 'normal'}</span>
              </span>
            </button>
          ))}
          {adminReports.length === 0 && <p className="muted">No hay reportes para mostrar.</p>}
        </div>
      </section>

      <section className="panel full-row admin-detail-panel">
        <div className="section-head">
          <h2>Detalle del reporte</h2>
          <span>{adminDetailLoading ? 'Cargando...' : selectedAdminReport?.public_code ?? 'Sin selección'}</span>
        </div>
        {!selectedAdminReport && <p className="muted">Selecciona un reporte para ver el detalle completo y decidir una acción.</p>}
        {selectedAdminReport && (
          <>
            <div className="detail-head">
              <span>{selectedAdminReport.public_code}</span>
              <strong className={`risk-chip ${riskTone(selectedAdminReport.risk)}`}>
                {riskLabel(selectedAdminReport.risk)}
              </strong>
            </div>
            <p className="message-box">{selectedAdminReport.message_text}</p>
            <div className="detail-meta-grid">
              <div>
                <span>Grado</span>
                <strong>{selectedAdminReport.grade_reference ?? 'sin grado'}</strong>
              </div>
              <div>
                <span>Sección</span>
                <strong>{selectedAdminReport.section_reference ?? 'sin sección'}</strong>
              </div>
              <div>
                <span>Edad</span>
                <strong>{selectedAdminReport.age_range ?? 'sin dato'}</strong>
              </div>
              <div>
                <span>Estado</span>
                <strong>{reportStatusLabel(selectedAdminReport.status)}</strong>
              </div>
              <div>
                <span>Creado</span>
                <strong>{new Date(selectedAdminReport.created_at).toLocaleString('es-PE')}</strong>
              </div>
              <div>
                <span>Actualizado</span>
                <strong>{new Date(selectedAdminReport.updated_at ?? selectedAdminReport.created_at).toLocaleString('es-PE')}</strong>
              </div>
            </div>

            <div className="detail-section">
              <h3>Datos emocionales</h3>
              <div className="detail-meta-grid">
                {Object.entries(selectedAdminReport.emotional_form ?? {}).map(([key, value]) => (
                  <div key={key}>
                    <span>{translateMetricLabel(key)}</span>
                    <strong>{formatDetailValue(value)}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>Lectura IA</h3>
              {selectedAdminReport.ai_analysis ? (
                <>
                  <div className={`ai-summary ${riskTone(selectedAdminReport.ai_analysis.risk_ai)}`}>
                    <p className="ai-summary-title">
                      La IA ve este caso como {riskLabel(selectedAdminReport.ai_analysis.risk_ai).toLowerCase()}.
                    </p>
                    <p className="ai-summary-body">
                      {describeRiskNarrative(
                        selectedAdminReport.ai_analysis.risk_ai,
                        selectedAdminReport.ai_analysis.dominant_emotion,
                      )}
                    </p>
                    <div className="ai-summary-meta">
                      <span>Emoción dominante: {selectedAdminReport.ai_analysis.dominant_emotion}</span>
                      <span>Confianza: {confidenceLabel(selectedAdminReport.ai_analysis.confidence)}</span>
                      <span>Modelo: {selectedAdminReport.ai_analysis.model_version ?? 'sin modelo'}</span>
                    </div>
                  </div>
                  <div className="emotion-grid">
                    {sortMetricEntries(selectedAdminReport.ai_analysis.emotion_scores).map(([emotion, value]) => (
                      <div className="emotion-row" key={emotion}>
                        <div className="emotion-head">
                          <span>{translateMetricLabel(emotion)}</span>
                          <strong>{Math.round(toPercent(value))}%</strong>
                        </div>
                        <div className="emotion-track">
                          <div className="emotion-fill" style={{ width: `${Math.max(6, toPercent(value))}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="signal-list">
                    {selectedAdminReport.ai_analysis.relevant_signals.map((signal) => (
                      <span key={signal}>{signal}</span>
                    ))}
                  </div>
                  <p className="muted">{selectedAdminReport.ai_analysis.note}</p>
                </>
              ) : (
                <p className="muted">La IA todavía no produjo una lectura para este reporte.</p>
              )}
            </div>

            <div className="detail-section">
              <h3>Revisión y derivación</h3>
              <div className="detail-meta-grid">
                <div>
                  <span>Cola IA</span>
                  <strong>{selectedAdminReport.analysis_queue.status}</strong>
                </div>
                <div>
                  <span>Intentos</span>
                  <strong>{selectedAdminReport.analysis_queue.attempts}</strong>
                </div>
                <div>
                  <span>Próximo intento</span>
                  <strong>{selectedAdminReport.analysis_queue.next_attempt_at ?? 'Sin dato'}</strong>
                </div>
                <div>
                  <span>Último error</span>
                  <strong>{selectedAdminReport.analysis_queue.last_error ?? 'Sin error'}</strong>
                </div>
              </div>
              {selectedAdminReport.psychological_review ? (
                <div className="detail-meta-grid">
                  <div>
                    <span>Riesgo validado</span>
                    <strong>{riskLabel(selectedAdminReport.psychological_review.validated_risk)}</strong>
                  </div>
                  <div>
                    <span>Revisado</span>
                    <strong>{new Date(selectedAdminReport.psychological_review.reviewed_at).toLocaleString('es-PE')}</strong>
                  </div>
                  <div className="full-span">
                    <span>Observación</span>
                    <strong>{selectedAdminReport.psychological_review.observation_internal ?? 'Sin observación'}</strong>
                  </div>
                </div>
              ) : (
                <p className="muted">Aún no hay revisión psicológica guardada.</p>
              )}
              {selectedAdminReport.derivation ? (
                <div className="detail-meta-grid">
                  <div>
                    <span>Estado derivación</span>
                    <strong>{reportStatusLabel(selectedAdminReport.derivation.status)}</strong>
                  </div>
                  <div>
                    <span>Derivado</span>
                    <strong>{new Date(selectedAdminReport.derivation.created_at).toLocaleString('es-PE')}</strong>
                  </div>
                  <div className="full-span">
                    <span>Resumen no sensible</span>
                    <strong>{selectedAdminReport.derivation.non_sensitive_summary}</strong>
                  </div>
                </div>
              ) : (
                <p className="muted">Este reporte todavía no fue enviado al director.</p>
              )}
            </div>
          </>
        )}
      </section>

      <form className="panel" onSubmit={createActivity}>
        <h2>Actividad preventiva</h2>
        <label>
          Titulo
          <input value={title} onChange={(event) => setTitle(event.target.value)} required />
        </label>
        <button>Registrar actividad</button>
      </form>

      <form className="panel" onSubmit={createUser}>
        <h2>Crear perfil interno</h2>
        <label>
          Correo
          <input value={userEmail} onChange={(event) => setUserEmail(event.target.value)} type="email" required />
        </label>
        <label>
          Contraseña
          <input value={userPassword} onChange={(event) => setUserPassword(event.target.value)} type="text" required />
        </label>
        <label>
          Rol
          <select value={userRole} onChange={(event) => setUserRole(event.target.value)}>
            <option value="PSYCHOLOGIST">Psicólogo</option>
            <option value="ADMIN_DIRECTOR">Administrador/Director</option>
          </select>
        </label>
        <button>Crear usuario</button>
        {createdCredential && (
          <div className="error credential-box">
            Perfil creado: <strong>{createdCredential.email}</strong> / <strong>{createdCredential.password}</strong>
            <br />
            Rol: {roleLabel(createdCredential.role)}
          </div>
        )}
      </form>

      <section className="panel">
        <h2>Actividades</h2>
        <div className="table-list">
          {activities.map((activity) => (
            <div className="list-row" key={activity.id}>
              <span>{activity.title}</span>
              <strong>{reportStatusLabel(activity.status)}</strong>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
