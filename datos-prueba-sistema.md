# Datos de prueba del sistema

Usa estos casos desde el formulario de `Reporte anonimo`.

Frontend:

```text
http://127.0.0.1:5173
```

Usuarios internos:

```text
PSICOLOGO01 / clave123
ADMIN01 / clave123
```

## Caso 1 - Reporte bajo

Esperado: aparece en psicologia como pendiente, con riesgo bajo o monitoreo. No debe pasar a administracion hasta que psicologia registre seguimiento.

```json
{
  "textoEmocional": "Hoy me siento tranquilo y acompanado en clases. Tengo amigos y puedo participar sin miedo.",
  "nivelAnimo": 5,
  "nivelSeguridad": 5,
  "grado": 1,
  "zonaJunin": 1,
  "recreoSolo": 0,
  "miedoParticipar": 0,
  "redesSociales": 0,
  "apoyoFamiliar": 1,
  "rendimiento": 0,
  "habilidadesSociales": 1,
  "entornoViolento": 0
}
```

## Caso 2 - Mensaje basura

Esperado: aparece para psicologia, pero la IA debe marcarlo como no accionable o con validacion humana. No debe usarse para administracion sin filtro psicologico.

```json
{
  "textoEmocional": "asdf asdf 1111 !!! kkkk",
  "nivelAnimo": 5,
  "nivelSeguridad": 5,
  "grado": 1,
  "zonaJunin": 1,
  "recreoSolo": 0,
  "miedoParticipar": 0,
  "redesSociales": 0,
  "apoyoFamiliar": 1,
  "rendimiento": 0,
  "habilidadesSociales": 1,
  "entornoViolento": 0
}
```

## Caso 3 - Relato confuso pero posible malestar

Esperado: aparece en psicologia con prioridad de validacion o seguimiento.

```json
{
  "textoEmocional": "No se q pasa pero ya no quiero salir al recreo, me siento raro y prefiero quedarme solo.",
  "nivelAnimo": 2,
  "nivelSeguridad": 3,
  "grado": 1,
  "zonaJunin": 1,
  "recreoSolo": 1,
  "miedoParticipar": 0,
  "redesSociales": 0,
  "apoyoFamiliar": 1,
  "rendimiento": 0,
  "habilidadesSociales": 0,
  "entornoViolento": 0
}
```

## Caso 4 - Riesgo medio por aislamiento

Esperado: aparece en psicologia como riesgo medio o seguimiento.

```json
{
  "textoEmocional": "En el salon casi nadie me habla. En el recreo me quedo solo y a veces se burlan cuando intento participar.",
  "nivelAnimo": 2,
  "nivelSeguridad": 3,
  "grado": 0,
  "zonaJunin": 0,
  "recreoSolo": 1,
  "miedoParticipar": 1,
  "redesSociales": 0,
  "apoyoFamiliar": 1,
  "rendimiento": 0,
  "habilidadesSociales": 0,
  "entornoViolento": 0
}
```

## Caso 5 - Alto riesgo por acoso verbal y ciberacoso

Esperado: aparece en psicologia con prioridad alta. Psicologia puede usar `Usar revision IA` y registrar seguimiento. Luego debe aparecer para administracion.

```json
{
  "textoEmocional": "Tengo miedo xq mis companeros me insultan, me ponen apodos y publican fotos mias en el grupo. Ya no quiero ir al colegio.",
  "nivelAnimo": 1,
  "nivelSeguridad": 2,
  "grado": 1,
  "zonaJunin": 1,
  "recreoSolo": 1,
  "miedoParticipar": 1,
  "redesSociales": 1,
  "apoyoFamiliar": 0,
  "rendimiento": 1,
  "habilidadesSociales": 0,
  "entornoViolento": 0
}
```

## Caso 6 - Riesgo critico por amenaza y agresion

Esperado: aparece en psicologia como riesgo critico o prioridad inmediata. Debe sugerir contencion y posible accion institucional luego del filtro psicologico.

```json
{
  "textoEmocional": "Me amenazan todos los dias, me empujan, me quitan mis cosas y dicen que si hablo me van a golpear peor.",
  "nivelAnimo": 1,
  "nivelSeguridad": 1,
  "grado": 1,
  "zonaJunin": 1,
  "recreoSolo": 1,
  "miedoParticipar": 1,
  "redesSociales": 0,
  "apoyoFamiliar": 0,
  "rendimiento": 1,
  "habilidadesSociales": 0,
  "entornoViolento": 1
}
```

## Caso 7 - Riesgo critico por autolesion

Esperado: prioridad inmediata. La IA debe indicar revision humana urgente. Usar solo para validar el flujo, no como diagnostico.

```json
{
  "textoEmocional": "Ya no quiero vivir, me siento desesperado y quiero desaparecer porque todos se burlan de mi.",
  "nivelAnimo": 1,
  "nivelSeguridad": 1,
  "grado": 1,
  "zonaJunin": 1,
  "recreoSolo": 1,
  "miedoParticipar": 1,
  "redesSociales": 1,
  "apoyoFamiliar": 0,
  "rendimiento": 1,
  "habilidadesSociales": 0,
  "entornoViolento": 0
}
```

## Flujo recomendado de prueba

1. Enviar un caso desde `Reporte anonimo`.
2. Entrar con `PSICOLOGO01 / clave123`.
3. Abrir `Recepcion y filtro de riesgos`.
4. Ver la historia del caso.
5. Revisar `Datos crudos anonimos` y `Revision inicial IA`.
6. Registrar seguimiento psicologico.
7. Entrar con `ADMIN01 / clave123`.
8. Abrir incidencias derivadas y crear una accion administrativa.
