import { createServer } from 'node:http';

const HOST = '127.0.0.1';
const PORT = Number(process.env.IA_LOCAL_PORT ?? 8000);
const MODEL_VERSION = 'rules-baseline-js-dev-1.0';

const KEYWORDS = {
  fear: {
    terms: ['miedo', 'temor', 'amenaza', 'amenazan', 'asusta', 'no quiero ir'],
    weight: 0.22,
  },
  sadness: {
    terms: ['triste', 'lloro', 'llorar', 'solo', 'sola', 'aislado', 'nadie'],
    weight: 0.18,
  },
  anxiety: {
    terms: ['ansiedad', 'nervioso', 'nerviosa', 'angustia', 'no duermo'],
    weight: 0.2,
  },
  anger: {
    terms: ['rabia', 'enojo', 'golpe', 'pegan', 'insultan', 'burlan'],
    weight: 0.14,
  },
};

const HIGH_RISK_TERMS = [
  'matarme',
  'suicidio',
  'no quiero vivir',
  'abuso',
  'violacion',
  'me toca',
  'arma',
  'amenaza',
  'golpe',
  'sangre',
];

const MEDIUM_RISK_TERMS = [
  'miedo',
  'burlan',
  'insultan',
  'solo',
  'aislado',
  'ansiedad',
  'triste',
  'whatsapp',
  'redes',
  'fotos',
];

const RISK_FORM_KEYS = [
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

function normalize(text) {
  return String(text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function bounded(value) {
  return Math.round(Math.min(value, 1) * 10000) / 10000;
}

function scoreEmotions(text, emotionalForm) {
  const scores = Object.fromEntries(Object.keys(KEYWORDS).map((emotion) => [emotion, 0.05]));

  for (const [emotion, config] of Object.entries(KEYWORDS)) {
    const matches = config.terms.filter((term) => text.includes(term));
    scores[emotion] += Math.min(0.75, matches.length * config.weight);
  }

  if (emotionalForm.fear === true || emotionalForm.miedo === true) scores.fear += 0.25;
  if (emotionalForm.sadness === true || emotionalForm.tristeza === true) scores.sadness += 0.25;
  if (emotionalForm.anxiety === true || emotionalForm.ansiedad === true) scores.anxiety += 0.25;
  if (emotionalForm.isolation === true || emotionalForm.aislamiento === true) {
    scores.sadness += 0.15;
    scores.fear += 0.1;
  }
  if (emotionalForm.school_insecurity === true) scores.fear += 0.2;

  return Object.fromEntries(Object.entries(scores).map(([emotion, value]) => [emotion, bounded(value)]));
}

function hasTruthyFlag(value) {
  return value === true || value === 1 || value === 'true' || value === '1' || value === 'si' || value === 'sí' || value === 'yes';
}

function classifyRisk(text, scores, emotionalForm) {
  const highMatches = HIGH_RISK_TERMS.filter((term) => text.includes(term)).length;
  const mediumMatches = MEDIUM_RISK_TERMS.filter((term) => text.includes(term)).length;
  const formRisk = RISK_FORM_KEYS.filter((key) => hasTruthyFlag(emotionalForm[key])).length;
  const maxScore = Math.max(...Object.values(scores));

  let riskPoints = highMatches * 3.5 + mediumMatches * 0.85 + formRisk * 0.55;
  if (maxScore >= 0.75) {
    riskPoints += 1.8;
  } else if (maxScore >= 0.55) {
    riskPoints += 1;
  } else if (maxScore >= 0.4) {
    riskPoints += 0.4;
  }

  if (highMatches >= 1 || riskPoints >= 6.5 || (maxScore >= 0.9 && formRisk >= 4)) return 'HIGH';
  if (riskPoints >= 2.7 || (mediumMatches >= 2 && formRisk >= 1) || maxScore >= 0.65) return 'MEDIUM';
  return 'LOW';
}

function detectSignals(text) {
  return [...HIGH_RISK_TERMS, ...MEDIUM_RISK_TERMS]
    .filter((term, index, terms) => text.includes(term) && terms.indexOf(term) === index)
    .slice(0, 8);
}

function analyzePayload(payload) {
  const text = normalize(payload.message);
  if (!text) {
    const error = new Error('message is required');
    error.status = 400;
    throw error;
  }

  const emotionalForm = payload.emotional_form && typeof payload.emotional_form === 'object'
    ? payload.emotional_form
    : {};
  const emotionScores = scoreEmotions(text, emotionalForm);
  const relevantSignals = detectSignals(text);
  const hasFormRisk = RISK_FORM_KEYS.some((key) => hasTruthyFlag(emotionalForm[key]));
  const dominantEmotion = relevantSignals.length === 0
    && !hasFormRisk
    && Math.max(...Object.values(emotionScores)) <= 0.1
    ? 'neutral'
    : Object.entries(emotionScores).sort((a, b) => b[1] - a[1])[0][0];
  const riskAi = classifyRisk(text, emotionScores, emotionalForm);
  const confidence = bounded(0.35 + relevantSignals.length * 0.06 + Math.max(...Object.values(emotionScores)) * 0.25);

  return {
    dominant_emotion: dominantEmotion,
    emotion_scores: emotionScores,
    risk_ai: riskAi,
    confidence: Math.min(confidence, 0.85),
    relevant_signals: relevantSignals,
    model_version: MODEL_VERSION,
    note: 'Clasificacion preliminar; no es diagnostico y requiere revision humana.',
  };
}

function legacyPayload(payload) {
  const response = analyzePayload({
    message: payload.frase_alumno,
    emotional_form: {
      recreo_solo: payload.Recreo_Solo,
      miedo_participar: payload.Miedo_Participar,
      entorno_violento: payload.Entorno_Violento,
    },
  });

  return {
    nivel_de_riesgo: {
      LOW: 'BAJO RIESGO',
      MEDIUM: 'RIESGO MEDIO',
      HIGH: 'ALTO RIESGO',
    }[response.risk_ai],
    puntaje_riesgo: Math.round(response.confidence * 100),
    prioridad_atencion: {
      LOW: 'monitoreo',
      MEDIUM: 'seguimiento',
      HIGH: 'alta',
    }[response.risk_ai],
    analisis_psicologico: response.note,
    accion_recomendada: 'Revision humana por psicologia escolar.',
    factores_detectados: response.relevant_signals,
    factores_protectores: [],
    confianza_global: response.confidence,
    detalles_tecnicos: {
      sentimiento_texto: response.dominant_emotion,
      confianza_texto: response.confidence,
      modelo: response.model_version,
    },
  };
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(Object.assign(new Error('payload too large'), { status: 413 }));
        request.destroy();
      }
    });
    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(Object.assign(new Error('invalid json'), { status: 400 }));
      }
    });
    request.on('error', reject);
  });
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(payload));
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://${HOST}:${PORT}`);

  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {});
    return;
  }

  try {
    if (request.method === 'GET' && url.pathname === '/') {
      sendJson(response, 200, { status: 'ok', model: MODEL_VERSION });
      return;
    }

    if (request.method === 'POST' && url.pathname === '/analyze') {
      sendJson(response, 200, analyzePayload(await readJson(request)));
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/evaluar_alerta') {
      sendJson(response, 200, legacyPayload(await readJson(request)));
      return;
    }

    sendJson(response, 404, { detail: 'not found' });
  } catch (error) {
    sendJson(response, error.status ?? 500, {
      detail: error instanceof Error ? error.message : 'internal error',
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Servicio IA local de desarrollo listo en http://${HOST}:${PORT}`);
});
