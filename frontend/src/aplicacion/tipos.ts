export type Role = 'PSYCHOLOGIST' | 'ADMIN_DIRECTOR' | 'psicologo' | 'admin';

export interface Session {
  accessToken: string;
  usuario: { id: string; nombre: string; correo: string; rol: Role };
}

export interface ReportListItem {
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

export interface AiAnalysisDetail {
  dominant_emotion: string;
  emotion_scores: Record<string, number>;
  risk_ai: string;
  confidence?: number | null;
  relevant_signals: string[];
  explanation?: string | null;
  recommended_action?: string | null;
  context_summary?: string | null;
  note: string;
  model_version?: string | null;
}

export interface ReportDetail extends ReportListItem {
  message_text: string;
  ai_analysis?: AiAnalysisDetail | null;
}

export interface AlertItem {
  id: string;
  report_id: string;
  risk_level: string;
  status: string;
  generated_by: string;
  created_at: string;
}

export interface AdminReportItem {
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

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminReportDetail extends AdminReportItem {
  age_range?: string | null;
  ai_analysis?: AiAnalysisDetail | null;
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

export interface PreventiveActivityItem {
  id: string;
  report_id?: string | null;
  title: string;
  description: string;
  objective: string;
  activity_type: string;
  responsible: string;
  scheduled_date: string;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface InternalUserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

