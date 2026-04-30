import { FormEvent, useState } from 'react';
import { AlertaEntidad, EstadoAlerta } from '../../../dominio/entidades/alerta.entidad';
import { HistoriaAlertaEntidad } from '../../../dominio/entidades/historia-alerta.entidad';
import { FiltroAlertasDto } from '../../../aplicacion/dto/filtro-alertas.dto';

interface PropiedadesAlertasPagina {
  alertas: AlertaEntidad[];
  historiaSeleccionada: HistoriaAlertaEntidad | null;
  alFiltrar: (filtros: FiltroAlertasDto) => Promise<void>;
  alSeleccionar: (id: string) => Promise<void>;
  alActualizar: (id: string, estado: EstadoAlerta) => Promise<void>;
  alRegistrarSeguimiento: (
    id: string,
    datos: { accionGlobal: string; descripcion: string },
  ) => Promise<void>;
}

const estados: Array<EstadoAlerta | ''> = ['', 'pendiente', 'evaluacion', 'cerrada'];

export function AlertasPagina({
  alertas,
  historiaSeleccionada,
  alFiltrar,
  alSeleccionar,
  alActualizar,
  alRegistrarSeguimiento,
}: PropiedadesAlertasPagina) {
  const [estado, setEstado] = useState<EstadoAlerta | ''>('');
  const [riesgoMinimo, setRiesgoMinimo] = useState('');
  const [riesgoMaximo, setRiesgoMaximo] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [accionGlobal, setAccionGlobal] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const filtrar = async (evento: FormEvent) => {
    evento.preventDefault();
    await alFiltrar({
      estado,
      riesgoMinimo: riesgoMinimo ? Number(riesgoMinimo) : undefined,
      riesgoMaximo: riesgoMaximo ? Number(riesgoMaximo) : undefined,
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined,
    });
  };

  const enviarSeguimiento = async (evento: FormEvent) => {
    evento.preventDefault();
    if (!historiaSeleccionada) return;
    await alRegistrarSeguimiento(historiaSeleccionada.alerta.id, {
      accionGlobal,
      descripcion,
    });
    setAccionGlobal('');
    setDescripcion('');
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-6">
        <form onSubmit={filtrar} className="rounded-3xl bg-white p-6 shadow-panel">
          <h1 className="text-2xl font-black text-slate-800">Recepcion y filtro de riesgos</h1>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <select
              value={estado}
              onChange={(evento) => setEstado(evento.target.value as EstadoAlerta | '')}
              className="rounded-2xl border border-slate-200 px-4 py-3"
            >
              {estados.map((valor) => (
                <option key={valor || 'todos'} value={valor}>
                  {valor || 'Todos los estados'}
                </option>
              ))}
            </select>
            <input
              value={riesgoMinimo}
              onChange={(evento) => setRiesgoMinimo(evento.target.value)}
              placeholder="Riesgo minimo"
              className="rounded-2xl border border-slate-200 px-4 py-3"
            />
            <input
              value={riesgoMaximo}
              onChange={(evento) => setRiesgoMaximo(evento.target.value)}
              placeholder="Riesgo maximo"
              className="rounded-2xl border border-slate-200 px-4 py-3"
            />
            <input
              type="date"
              value={fechaDesde}
              onChange={(evento) => setFechaDesde(evento.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3"
            />
            <input
              type="date"
              value={fechaHasta}
              onChange={(evento) => setFechaHasta(evento.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2"
            />
          </div>
          <button
            type="submit"
            className="mt-6 rounded-2xl bg-marca-700 px-5 py-3 font-semibold text-white"
          >
            Aplicar filtros
          </button>
        </form>

        <div className="rounded-3xl bg-white p-6 shadow-panel">
          <h2 className="text-2xl font-black text-slate-800">Casos anonimos</h2>
          <div className="mt-6 space-y-4">
            {alertas.map((alerta) => (
              <article
                key={alerta.id}
                className="rounded-3xl border border-slate-100 bg-slate-50 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                      Caso {alerta.estudianteId}
                    </p>
                    <p className="mt-3 text-3xl font-black text-marca-800">
                      Riesgo {alerta.puntajeRiesgo}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Estado actual: {alerta.estado}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => void alSeleccionar(alerta.id)}
                      className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                    >
                      Ver historia
                    </button>
                    <select
                      value={alerta.estado}
                      onChange={(evento) =>
                        void alActualizar(alerta.id, evento.target.value as EstadoAlerta)
                      }
                      className="rounded-2xl border border-slate-200 px-4 py-3"
                    >
                      {estados
                        .filter((valor): valor is EstadoAlerta => valor !== '')
                        .map((valor) => (
                          <option key={valor} value={valor}>
                            {valor}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </article>
            ))}

            {alertas.length === 0 && (
              <p className="text-sm text-slate-500">No hay alertas para los filtros aplicados.</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-panel">
        <h2 className="text-2xl font-black text-slate-800">Historia anonima del caso</h2>
        {!historiaSeleccionada && (
          <p className="mt-6 text-sm text-slate-500">
            Selecciona una alerta para revisar su historia y registrar acciones.
          </p>
        )}

        {historiaSeleccionada && (
          <div className="mt-6 space-y-6">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                Caso {historiaSeleccionada.alerta.estudianteId}
              </p>
              <p className="mt-2 text-2xl font-black text-marca-800">
                Riesgo {historiaSeleccionada.alerta.puntajeRiesgo}
              </p>
              <p className="mt-3 text-sm text-slate-600">
                Estado: {historiaSeleccionada.alerta.estado}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Actualizado: {new Date(historiaSeleccionada.alerta.ultimaActualizacion).toLocaleString('es-PE')}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <h3 className="text-lg font-bold text-slate-800">Relato emocional</h3>
              <p className="mt-3 leading-7 text-slate-700">
                {historiaSeleccionada.encuesta.textoEmocional}
              </p>
              <p className="mt-4 text-sm text-slate-500">
                Animo {historiaSeleccionada.encuesta.nivelAnimo} / Seguridad {historiaSeleccionada.encuesta.nivelSeguridad}
              </p>
            </div>

            <form onSubmit={enviarSeguimiento} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <h3 className="text-lg font-bold text-slate-800">Accion y seguimiento</h3>
              <input
                value={accionGlobal}
                onChange={(evento) => setAccionGlobal(evento.target.value)}
                placeholder="Accion global sugerida"
                className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3"
                required
              />
              <textarea
                value={descripcion}
                onChange={(evento) => setDescripcion(evento.target.value)}
                placeholder="Describe el seguimiento anonimo del caso"
                className="mt-4 min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3"
                required
              />
              <button
                type="submit"
                className="mt-4 rounded-2xl bg-acento-500 px-5 py-3 font-semibold text-slate-900"
              >
                Guardar seguimiento
              </button>
            </form>

            <div>
              <h3 className="text-lg font-bold text-slate-800">Historial del caso</h3>
              <div className="mt-4 space-y-3">
                {historiaSeleccionada.seguimientos.map((seguimiento) => (
                  <article key={seguimiento.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="font-semibold text-slate-800">{seguimiento.accionGlobal}</p>
                    <p className="mt-2 leading-7 text-slate-700">{seguimiento.descripcion}</p>
                    <p className="mt-3 text-sm text-slate-500">
                      {new Date(seguimiento.fechaCreacion).toLocaleString('es-PE')}
                    </p>
                  </article>
                ))}
                {historiaSeleccionada.seguimientos.length === 0 && (
                  <p className="text-sm text-slate-500">Aun no hay acciones registradas para este caso.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
