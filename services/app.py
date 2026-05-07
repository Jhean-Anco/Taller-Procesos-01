from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
import joblib
import numpy as np

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