import { PanelEntidad } from '../../../dominio/entidades/panel.entidad';

interface PropiedadesPanelPagina {
  panel: PanelEntidad | null;
  cargando: boolean;
}

const tarjetas = [
  { clave: 'totalIncidencias', etiqueta: 'Incidencias' },
  { clave: 'incidenciasPendientes', etiqueta: 'Pendientes' },
  { clave: 'incidenciasEnEvaluacion', etiqueta: 'En evaluacion' },
  { clave: 'procesosAdministrativos', etiqueta: 'Procesos iniciados' },
  { clave: 'procesosActivos', etiqueta: 'Procesos activos' },
  { clave: 'procesosCompletados', etiqueta: 'Procesos completados' },
  { clave: 'avancesRegistrados', etiqueta: 'Avances registrados' },
] as const;

export function PanelPagina({ panel, cargando }: PropiedadesPanelPagina) {
  if (cargando) {
    return <div className="rounded-3xl bg-white p-8 shadow-panel">Cargando panel...</div>;
  }

  if (!panel) {
    return <div className="rounded-3xl bg-white p-8 shadow-panel">Sin datos disponibles.</div>;
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] bg-gradient-to-r from-marca-800 via-marca-700 to-marca-500 p-8 text-white shadow-panel">
        <p className="text-sm uppercase tracking-[0.25em] text-marca-100">SafeSchool AI</p>
        <h1 className="mt-3 text-4xl font-black">Panel administrativo de incidencias</h1>
        <p className="mt-4 max-w-3xl text-marca-50">
          Seguimiento institucional de medidas operativas derivadas de incidencias anonimas.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {tarjetas.map((tarjeta) => (
          <article key={tarjeta.clave} className="rounded-3xl bg-white p-6 shadow-panel">
            <p className="text-sm text-slate-500">{tarjeta.etiqueta}</p>
            <p className="mt-3 text-4xl font-extrabold text-marca-800">
              {panel[tarjeta.clave]}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl bg-white p-6 shadow-panel">
          <h2 className="text-xl font-bold text-slate-800">Riesgo promedio</h2>
          <p className="mt-4 text-5xl font-black text-acento-500">
            {panel.riesgoPromedio.toFixed(1)}
          </p>
          <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-acento-300 to-acento-500"
              style={{ width: `${Math.min(panel.riesgoPromedio, 100)}%` }}
            />
          </div>
        </article>

        <div className="grid gap-4">
          <article className="rounded-3xl bg-white p-6 shadow-panel">
            <h2 className="text-xl font-bold text-slate-800">Cumplimiento de procesos</h2>
            <p className="mt-4 text-5xl font-black text-marca-700">
              {panel.cumplimientoProcesos.toFixed(1)}%
            </p>
            <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-marca-500 to-marca-700"
                style={{ width: `${Math.min(panel.cumplimientoProcesos, 100)}%` }}
              />
            </div>
          </article>

          <article className="rounded-3xl border border-marca-200 bg-marca-50 p-6 shadow-panel">
            <h2 className="text-xl font-bold text-marca-900">Ejecucion institucional</h2>
            <p className="mt-4 text-sm leading-7 text-marca-900">
              {panel.mensajeInstitucional}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
