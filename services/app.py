<<<<<<< HEAD
from difflib import get_close_matches
from pathlib import Path
from typing import Dict, List, Set, Tuple
import re
import unicodedata

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
=======
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
>>>>>>> e0eea8016864828a41c20f70502c5d1e8d13e17a
from transformers import pipeline
import joblib
import numpy as np

<<<<<<< HEAD
BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(
    title="API Deteccion de Bullying",
    version="1.2",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

nlp_pipeline = None
arbol_decision = None
error_modelos = None

try:
    print("Cargando modelo NLP...")
    nlp_pipeline = pipeline(
        "sentiment-analysis",
        model="finiteautomata/beto-sentiment-analysis",
    )

    print("Cargando arbol de decision...")
    arbol_decision = joblib.load(BASE_DIR / "modelo_arbol.pkl")
    print("Modelos listos.")
except Exception as e:
    error_modelos = str(e)
    print(f"Error al cargar modelos: {e}")


class DatosAlumno(BaseModel):
    frase_alumno: str
    Grado: int = Field(..., ge=0, le=1)              # 0 primaria, 1 secundaria
    Zona_Junin: int = Field(..., ge=0, le=1)         # 0 rural, 1 urbana
    Recreo_Solo: int = Field(..., ge=0, le=1)
    Animo_Manana: int = Field(..., ge=0, le=1)
    Miedo_Participar: int = Field(..., ge=0, le=1)
    Redes_Sociales: int = Field(..., ge=0, le=1)
    Apoyo_Familiar: int = Field(..., ge=0, le=1)
    Rendimiento: int = Field(..., ge=0, le=1)
    Hab_Sociales: int = Field(..., ge=0, le=1)
    Entorno_Violento: int = Field(..., ge=0, le=1)


STOPWORDS: Set[str] = {
    "a", "al", "algo", "alli", "ante", "antes", "asi", "cada", "como",
    "con", "contra", "cuando", "de", "del", "desde", "donde", "el",
    "ella", "ellos", "en", "entre", "era", "es", "esa", "ese", "eso",
    "esta", "estaba", "estan", "este", "esto", "fue", "ha", "hay",
    "he", "la", "las", "le", "les", "lo", "los", "mas", "me", "mi",
    "mis", "mucho", "muy", "no", "nos", "o", "para", "pero", "por",
    "porque", "que", "se", "si", "sin", "son", "su", "sus", "tambien",
    "te", "tengo", "todo", "un", "una", "uno", "ya", "yo",
}

ABREVIATURAS: Dict[str, str] = {
    "aki": "aqui",
    "bn": "bien",
    "c": "se",
    "d": "de",
    "k": "que",
    "ke": "que",
    "komo": "como",
    "m": "me",
    "nse": "no se",
    "pa": "para",
    "porke": "porque",
    "porq": "porque",
    "pq": "porque",
    "q": "que",
    "qiero": "quiero",
    "qro": "quiero",
    "stoy": "estoy",
    "toy": "estoy",
    "tngo": "tengo",
    "x": "por",
    "xfa": "por favor",
    "xq": "porque",
}

LEXICO_CATEGORIAS = {
    "riesgo vital o autolesion": {
        "peso": 50,
        "terminos": {
            "morir", "matarme", "suicidar", "suicidio", "cortarme",
            "hacerme dano", "quitarme la vida", "no quiero vivir",
            "desaparecer", "me quiero morir",
        },
    },
    "abuso o acoso sexual": {
        "peso": 46,
        "terminos": {
            "abuso", "acoso sexual", "me toca", "me tocaron", "tocamientos",
            "violacion", "insinua", "me mira raro",
        },
    },
    "agresion fisica": {
        "peso": 30,
        "terminos": {
            "golpe", "golpes", "pega", "pegan", "patada", "empuja",
            "empujan", "jalonea", "escupe", "escupen", "herida", "dolor",
            "me hacen dano",
        },
    },
    "amenaza o extorsion": {
        "peso": 28,
        "terminos": {
            "amenaza", "amenazan", "chantaje", "me obligan", "me siguen",
            "me esperan", "me quitan", "me roban", "roban", "quitan",
        },
    },
    "agresion verbal o humillacion": {
        "peso": 22,
        "terminos": {
            "insulto", "insultos", "insultan", "burla", "burlan",
            "humilla", "humillan", "apodo", "apodos", "ridiculizan",
            "se rien", "molestan", "me molestan",
        },
    },
    "exclusion o aislamiento": {
        "peso": 18,
        "terminos": {
            "solo", "sola", "aislado", "aislada", "nadie me habla",
            "no me juntan", "no me incluyen", "rechazan", "ignoran",
            "sin amigos",
        },
    },
    "ciberacoso": {
        "peso": 20,
        "terminos": {
            "whatsapp", "facebook", "instagram", "tiktok", "redes",
            "chat", "fotos", "video", "memes", "publican", "perfil falso",
            "grupo", "captura",
        },
    },
    "miedo y evitacion": {
        "peso": 18,
        "terminos": {
            "miedo", "temor", "asusta", "no quiero ir", "faltar",
            "esconderme", "evito", "evitar", "nervioso", "nerviosa",
        },
    },
    "malestar emocional": {
        "peso": 16,
        "terminos": {
            "triste", "tristeza", "lloro", "llorar", "ansiedad",
            "angustia", "cansado", "cansada", "no duermo", "pesadillas",
            "me siento mal",
        },
    },
    "violencia familiar o entorno": {
        "peso": 18,
        "terminos": {
            "violencia", "gritos", "pelean", "borracho", "maltrato",
            "castigo", "me pegan en casa", "problemas en casa",
        },
    },
    "afectacion academica": {
        "peso": 10,
        "terminos": {
            "notas", "tareas", "examen", "rendimiento", "baje",
            "concentrar", "clase", "participar", "profesor", "colegio",
        },
    },
}

TERMINOS_PROTECTORES = {
    "apoyo", "tutor", "psicologo", "amigo", "amiga", "amigos", "confio",
    "ayuda", "seguro", "acompanado", "acompanada",
}

VOCABULARIO_CORRECCION = (
    set().union(*(datos["terminos"] for datos in LEXICO_CATEGORIAS.values()))
    | TERMINOS_PROTECTORES
    | STOPWORDS
    | set(ABREVIATURAS.values())
)
VOCABULARIO_CORRECCION = {
    palabra
    for termino in VOCABULARIO_CORRECCION
    for palabra in termino.split()
}


@app.get("/")
async def estado_servicio():
    return {
        "estado": "Online",
        "mensaje": "IA activa.",
        "version": "1.2",
        "modelo_nlp": "finiteautomata/beto-sentiment-analysis",
        "modelo_arbol": "modelo_arbol.pkl",
        "analisis_lenguaje_natural": True,
        "filtrado_relato_confuso": True,
        "modelos_cargados": nlp_pipeline is not None and arbol_decision is not None,
        "error_modelos": error_modelos,
    }


def quitar_acentos(texto: str) -> str:
    normalizado = unicodedata.normalize("NFD", texto)
    return "".join(
        caracter
        for caracter in normalizado
        if unicodedata.category(caracter) != "Mn"
    )


def limpiar_texto(texto: str) -> str:
    texto = quitar_acentos(texto.lower())
    texto = re.sub(r"https?://\S+|www\.\S+", " enlace ", texto)
    texto = re.sub(r"@\w+|#\w+", " mencion ", texto)
    texto = re.sub(r"(.)\1{2,}", r"\1\1", texto)
    texto = re.sub(r"[^a-z0-9\s]", " ", texto)
    texto = re.sub(r"\s+", " ", texto).strip()
    return texto


def tokenizar_y_corregir(texto_limpio: str) -> Tuple[List[str], str]:
    tokens_originales = re.findall(r"[a-z0-9]+", texto_limpio)
    tokens: List[str] = []

    for token in tokens_originales:
        expansion = ABREVIATURAS.get(token)
        if expansion:
            tokens.extend(expansion.split())
            continue

        if len(token) >= 5 and token not in VOCABULARIO_CORRECCION:
            cercano = get_close_matches(
                token,
                VOCABULARIO_CORRECCION,
                n=1,
                cutoff=0.87,
            )
            tokens.append(cercano[0] if cercano else token)
        else:
            tokens.append(token)

    return tokens, " ".join(tokens)


def evaluar_calidad_relato(texto_original: str, tokens: List[str]) -> Dict[str, object]:
    texto_sin_espacios = re.sub(r"\s+", "", texto_original)
    total = max(len(texto_sin_espacios), 1)
    letras = sum(1 for caracter in texto_sin_espacios if caracter.isalpha())
    ratio_letras = letras / total
    significativos = [
        token
        for token in tokens
        if token not in STOPWORDS and len(token) >= 3
    ]
    distintos = set(significativos)
    desconocidos = [
        token for token in significativos if token not in VOCABULARIO_CORRECCION
    ]
    ratio_desconocidos = len(desconocidos) / max(len(significativos), 1)
    repeticion_excesiva = (
        max(significativos.count(token) for token in distintos) / len(significativos) > 0.65
        and ratio_desconocidos > 0.65
    ) if distintos else False
    sin_vocales = [
        token for token in significativos if not re.search(r"[aeiou]", token)
    ]
    ratio_sin_vocales = len(sin_vocales) / max(len(significativos), 1)

    if len(texto_sin_espacios) < 10 or len(tokens) < 2:
        calidad = "ruido"
        motivo = "mensaje demasiado corto"
    elif ratio_letras < 0.45:
        calidad = "ruido"
        motivo = "muchos simbolos o numeros"
    elif repeticion_excesiva:
        calidad = "ruido"
        motivo = "repeticion sin contenido claro"
    elif len(significativos) < 4 and ratio_desconocidos > 0.75:
        calidad = "ruido"
        motivo = "palabras no reconocibles para el contexto escolar"
    elif ratio_sin_vocales > 0.55 and len(significativos) < 7:
        calidad = "ruido"
        motivo = "palabras no interpretables"
    elif len(significativos) < 4:
        calidad = "confuso"
        motivo = "poca informacion contextual"
    elif len(significativos) < 8:
        calidad = "parcial"
        motivo = "relato breve pero interpretable"
    else:
        calidad = "suficiente"
        motivo = "relato interpretable"

    return {
        "calidad": calidad,
        "motivo": motivo,
        "tokens_significativos": significativos,
        "ratio_letras": round(ratio_letras, 4),
    }


def contiene_termino(texto: str, tokens: Set[str], termino: str) -> bool:
    termino = limpiar_texto(termino)
    if " " in termino:
        return termino in texto
    return termino in tokens


def detectar_categorias(texto: str, tokens: List[str]) -> Dict[str, object]:
    tokens_set = set(tokens)
    factores: List[str] = []
    temas: List[str] = []
    puntaje_textual = 0

    for categoria, datos in LEXICO_CATEGORIAS.items():
        coincidencias = sorted(
            {
                limpiar_texto(termino)
                for termino in datos["terminos"]
                if contiene_termino(texto, tokens_set, termino)
            }
        )
        if not coincidencias:
            continue

        temas.append(categoria)
        puntaje_textual += int(datos["peso"]) + min(8, (len(coincidencias) - 1) * 3)
        factores.append(f"{categoria}: {', '.join(coincidencias[:4])}")

    return {
        "puntaje_textual": min(58, puntaje_textual),
        "factores": factores,
        "temas": temas,
    }


def detectar_protectores(texto: str, tokens: List[str]) -> List[str]:
    tokens_set = set(tokens)
    protectores = []
    for termino in sorted(TERMINOS_PROTECTORES):
        if not contiene_termino(texto, tokens_set, termino):
            continue
        negado = re.search(
            rf"\b(no|nunca|nadie)\b(?:\s+\w+){{0,3}}\s+{re.escape(termino)}\b",
            texto,
        )
        if not negado:
            protectores.append(f"referencia a {termino}")
    return protectores[:5]


def inferir_intencion(calidad: str, temas: List[str]) -> str:
    if calidad == "ruido":
        return "mensaje no accionable sin validacion humana"
    if "riesgo vital o autolesion" in temas:
        return "posible urgencia de contencion emocional"
    if "abuso o acoso sexual" in temas:
        return "posible situacion grave que requiere activacion de protocolo"
    if any(
        tema in temas
        for tema in [
            "agresion fisica",
            "amenaza o extorsion",
            "agresion verbal o humillacion",
            "exclusion o aislamiento",
            "ciberacoso",
        ]
    ):
        return "posible convivencia violenta o acoso escolar"
    if any(tema in temas for tema in ["miedo y evitacion", "malestar emocional"]):
        return "malestar emocional que requiere entrevista preventiva"
    if "violencia familiar o entorno" in temas:
        return "riesgo del entorno que debe ser contrastado por psicologia"
    return "relato general que requiere lectura profesional"


def analizar_lenguaje_humano(texto_original: str) -> Dict[str, object]:
    texto_limpio = limpiar_texto(texto_original)
    tokens, texto_normalizado = tokenizar_y_corregir(texto_limpio)
    calidad = evaluar_calidad_relato(texto_original, tokens)
    categorias = detectar_categorias(texto_normalizado, tokens)
    protectores = detectar_protectores(texto_normalizado, tokens)
    temas = categorias["temas"]
    intencion = inferir_intencion(str(calidad["calidad"]), temas)

    return {
        "texto_normalizado": texto_normalizado,
        "tokens": tokens,
        "calidad": calidad["calidad"],
        "motivo_calidad": calidad["motivo"],
        "puntaje_textual": categorias["puntaje_textual"],
        "factores": categorias["factores"],
        "factores_protectores": protectores,
        "temas": temas,
        "intencion": intencion,
        "requiere_validacion_humana": calidad["calidad"] in {"ruido", "confuso"},
        "es_ruido": calidad["calidad"] == "ruido",
    }


def evaluar_variables_formulario(datos: DatosAlumno) -> Tuple[int, List[str], List[str]]:
    puntaje = 0
    factores_detectados = []
    factores_protectores = []

    reglas_riesgo = [
        (datos.Recreo_Solo == 1, 8, "aislamiento durante recreo"),
        (datos.Animo_Manana == 1, 10, "animo bajo al iniciar el dia"),
        (datos.Miedo_Participar == 1, 12, "miedo de participar"),
        (datos.Redes_Sociales == 1, 8, "riesgo asociado a redes sociales"),
        (datos.Apoyo_Familiar == 0, 10, "bajo apoyo familiar percibido"),
        (datos.Rendimiento == 1, 6, "rendimiento afectado"),
        (datos.Hab_Sociales == 0, 8, "habilidades sociales limitadas"),
        (datos.Entorno_Violento == 1, 14, "exposicion a entorno violento"),
    ]

    for condicion, peso, factor in reglas_riesgo:
        if condicion:
            puntaje += peso
            factores_detectados.append(factor)

    if datos.Apoyo_Familiar == 1:
        factores_protectores.append("apoyo familiar disponible")
    if datos.Hab_Sociales == 1:
        factores_protectores.append("habilidades sociales adecuadas")

    return puntaje, factores_detectados, factores_protectores


def nivelar_riesgo(puntaje: int, calidad: str) -> Tuple[str, str]:
    if puntaje >= 85:
        return "RIESGO CRITICO", "inmediata"
    if puntaje >= 65:
        return "ALTO RIESGO", "alta"
    if puntaje >= 40:
        return "RIESGO MEDIO", "seguimiento"
    if calidad in {"ruido", "confuso"}:
        return "REPORTE NO ACCIONABLE", "validacion"
    return "BAJO RIESGO", "monitoreo"


def construir_analisis_psicologico(
    nivel: str,
    prioridad: str,
    analisis_lenguaje: Dict[str, object],
    factores_detectados: List[str],
) -> str:
    calidad = str(analisis_lenguaje["calidad"])
    motivo = str(analisis_lenguaje["motivo_calidad"])
    intencion = str(analisis_lenguaje["intencion"])
    temas = analisis_lenguaje["temas"]
    temas_texto = ", ".join(temas[:4]) if temas else "sin tema de riesgo claro"
    factores_texto = "; ".join(factores_detectados[:5]) or "sin factores principales"

    if calidad == "ruido":
        return (
            f"Lectura IA: reporte no accionable por ahora ({motivo}). "
            "Paso psicologico: validar si el relato anonimo contiene informacion real. "
            "Criterio de escalamiento: no derivar a administracion sin filtro profesional."
        )

    return (
        f"Lectura IA: {intencion}. Nivel {nivel}; prioridad {prioridad}. "
        f"Foco de revision: {temas_texto}. Senales clave: {factores_texto}. "
        "Uso sugerido: validar el relato crudo y registrar una accion global anonima."
    )


def construir_accion_recomendada(
    nivel: str,
    prioridad: str,
    analisis_lenguaje: Dict[str, object],
) -> str:
    calidad = str(analisis_lenguaje["calidad"])
    temas = analisis_lenguaje["temas"]
    temas_texto = ", ".join(temas[:4]) if temas else "convivencia escolar"

    if calidad in {"ruido", "confuso"} and not temas:
        return (
            "Borrador psicologico: validar relato anonimo y cerrar o monitorear si no "
            "hay informacion accionable. Borrador administrativo: no derivar ni tomar "
            "decision institucional hasta recibir filtro psicologico."
        )

    if nivel == "RIESGO CRITICO":
        return (
            "Borrador psicologico: revisar hoy el relato crudo, activar contencion y "
            "registrar filtro profesional. Borrador administrativo: si psicologia "
            f"deriva, preparar medidas inmediatas sobre {temas_texto}, sin exponer "
            "identidad ni texto crudo."
        )

    if nivel == "ALTO RIESGO":
        return (
            "Borrador psicologico: entrevista u observacion prioritaria y accion global "
            "de proteccion. Borrador administrativo: actuar solo con sintesis filtrada "
            f"sobre {temas_texto}, enfocando aula, patio, redes o convivencia."
        )

    if prioridad == "seguimiento":
        return (
            "Borrador psicologico: contrastar el relato con seguimiento preventivo. "
            "Borrador administrativo: esperar filtro psicologico y considerar acciones "
            "generales de convivencia solo si el caso se repite o se deriva."
        )

    return (
        "Borrador psicologico: monitoreo preventivo y cierre si no hay senales nuevas. "
        "Borrador administrativo: sin accion directa salvo acumulacion de patrones."
    )


def calcular_confianza_global(
    calidad: str,
    confianza_texto: float,
    prediccion_arbol: int,
    cantidad_factores: int,
) -> float:
    aporte_calidad = {
        "suficiente": 0.34,
        "parcial": 0.25,
        "confuso": 0.16,
        "ruido": 0.08,
    }.get(calidad, 0.12)
    confianza = (
        aporte_calidad
        + min(confianza_texto, 1.0) * 0.28
        + (0.18 if prediccion_arbol == 1 else 0.08)
        + min(cantidad_factores, 6) * 0.035
    )
    if calidad == "ruido":
        confianza = min(confianza, 0.48)
    return round(min(1.0, confianza), 4)


def construir_evaluacion(
    datos: DatosAlumno,
    sentimiento: str,
    confianza_texto: float,
    prediccion_arbol: int,
    analisis_lenguaje: Dict[str, object],
):
    calidad = str(analisis_lenguaje["calidad"])
    es_ruido = bool(analisis_lenguaje["es_ruido"])
    puntaje_formulario, factores_formulario, protectores_formulario = (
        evaluar_variables_formulario(datos)
    )

    puntaje = puntaje_formulario
    factores_detectados = []
    factores_protectores = protectores_formulario + list(
        analisis_lenguaje["factores_protectores"]
    )

    if prediccion_arbol == 1:
        puntaje += 34
        factores_detectados.append("patron conductual compatible con alerta")

    if not es_ruido:
        puntaje += int(analisis_lenguaje["puntaje_textual"])
        factores_detectados.extend(list(analisis_lenguaje["factores"]))

        if sentimiento.upper().startswith("NEG"):
            puntaje += 22 if confianza_texto >= 0.80 else 14
            factores_detectados.append("relato con carga emocional negativa")
        elif sentimiento.upper().startswith("POS") and puntaje < 40:
            factores_protectores.append("tono textual positivo o estable")
    else:
        factores_detectados.append(
            f"calidad del relato no accionable: {analisis_lenguaje['motivo_calidad']}"
        )

    factores_detectados.extend(factores_formulario)
    puntaje = max(0, min(100, int(round(puntaje))))

    if es_ruido and prediccion_arbol == 0 and puntaje_formulario < 30:
        puntaje = min(puntaje, 25)

    nivel, prioridad = nivelar_riesgo(puntaje, calidad)
    analisis = construir_analisis_psicologico(
        nivel,
        prioridad,
        analisis_lenguaje,
        factores_detectados,
    )
    accion = construir_accion_recomendada(nivel, prioridad, analisis_lenguaje)
    confianza_global = calcular_confianza_global(
        calidad,
        confianza_texto,
        prediccion_arbol,
        len(factores_detectados),
    )

    factores_detectados = [f"calidad relato: {calidad}"] + factores_detectados
    if analisis_lenguaje["requiere_validacion_humana"]:
        factores_detectados.append("requiere validacion humana antes de escalar")

    return {
        "nivel_de_riesgo": nivel,
        "puntaje_riesgo": puntaje,
        "prioridad_atencion": prioridad,
        "analisis_psicologico": analisis,
        "accion_recomendada": accion,
        "factores_detectados": factores_detectados,
        "factores_protectores": list(dict.fromkeys(factores_protectores)),
        "confianza_global": confianza_global,
    }


@app.post("/api/evaluar_alerta")
async def evaluar_alerta(datos: DatosAlumno):
    if nlp_pipeline is None or arbol_decision is None:
        raise HTTPException(
            status_code=503,
            detail=f"Modelos de IA no disponibles: {error_modelos or 'sin detalle'}",
        )

    try:
        analisis_lenguaje = analizar_lenguaje_humano(datos.frase_alumno)
        analisis_texto = nlp_pipeline(datos.frase_alumno)[0]
        sentimiento = analisis_texto["label"]
        confianza_texto = float(analisis_texto["score"])

=======
# 1. Iniciamos la API
app = FastAPI(
    title="API Detección de Bullying",
    version="1.0"
)

# 2. Cargar Modelos
try:
    print("Cargando modelo NLP...")
    nlp_pipeline = pipeline("sentiment-analysis", model="finiteautomata/beto-sentiment-analysis")
    
    print("Cargando Árbol de Decisión...")
    arbol_decision = joblib.load("modelo_arbol.pkl") 
    print("✅ Modelos listos.")
except Exception as e:
    print(f"❌ Error al cargar modelos: {e}")

# 3. El formato EXACTO de los datos que debe enviar Jhean
class DatosAlumno(BaseModel):
    frase_alumno: str
    Grado: int              # 0 para Primaria, 1 para Secundaria
    Zona_Junin: int         # 0 para Rural, 1 para Urbana
    Recreo_Solo: int
    Animo_Manana: int
    Miedo_Participar: int
    Redes_Sociales: int
    Apoyo_Familiar: int
    Rendimiento: int
    Hab_Sociales: int
    Entorno_Violento: int

# 4. Endpoint GET (Para verificar conexión)
@app.get("/")
async def estado_servicio():
    return {"estado": "Online", "mensaje": "IA activa."}

# 5. Endpoint POST (Evaluación)
@app.post("/api/evaluar_alerta")
async def evaluar_alerta(datos: DatosAlumno):
    try:
        # A) PROCESAR TEXTO
        analisis_texto = nlp_pipeline(datos.frase_alumno)[0]
        sentimiento = analisis_texto['label'] 
        confianza_texto = analisis_texto['score']
        
        # B) PREPARAR ARREGLO NUMÉRICO (Orden estricto del Excel)
>>>>>>> e0eea8016864828a41c20f70502c5d1e8d13e17a
        datos_para_el_arbol = np.array([[
            datos.Grado,
            datos.Zona_Junin,
            datos.Recreo_Solo,
            datos.Animo_Manana,
            datos.Miedo_Participar,
            datos.Redes_Sociales,
            datos.Apoyo_Familiar,
            datos.Rendimiento,
            datos.Hab_Sociales,
<<<<<<< HEAD
            datos.Entorno_Violento,
        ]])

        prediccion_numerica = int(arbol_decision.predict(datos_para_el_arbol)[0])
        evaluacion = construir_evaluacion(
            datos,
            sentimiento,
            confianza_texto,
            prediccion_numerica,
            analisis_lenguaje,
        )

        return {
            **evaluacion,
            "detalles_tecnicos": {
                "prediccion_arbol": prediccion_numerica,
                "sentimiento_texto": sentimiento,
                "confianza_texto": confianza_texto,
                "calidad_relato": analisis_lenguaje["calidad"],
                "motivo_calidad": analisis_lenguaje["motivo_calidad"],
                "intencion_comunicativa": analisis_lenguaje["intencion"],
                "requiere_validacion_humana": analisis_lenguaje[
                    "requiere_validacion_humana"
                ],
                "temas_detectados": analisis_lenguaje["temas"],
                "texto_normalizado": analisis_lenguaje["texto_normalizado"],
                "modelo_nlp": "finiteautomata/beto-sentiment-analysis",
                "modelo_arbol": "modelo_arbol.pkl",
            },
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
=======
            datos.Entorno_Violento
        ]])
        
        # C) PREDICCIÓN DEL ÁRBOL
        prediccion_numerica = int(arbol_decision.predict(datos_para_el_arbol)[0])
        
        # D) FUSIÓN DE IA Y RESPUESTA
        if prediccion_numerica == 1 or sentimiento == 'NEG':
            riesgo = "ALTO RIESGO"
            recomendacion = "Alerta psicológica. Se detectó patrón de riesgo numérico o texto agresivo/depresivo."
        else:
            riesgo = "BAJO RIESGO"
            recomendacion = "Estable. Mantener monitoreo."

        return {
            "nivel_de_riesgo": riesgo,
            "analisis_psicologico": recomendacion,
            "detalles_tecnicos": {
                "prediccion_arbol": prediccion_numerica,
                "sentimiento_texto": sentimiento
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
>>>>>>> e0eea8016864828a41c20f70502c5d1e8d13e17a
