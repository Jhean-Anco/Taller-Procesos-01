import { FormEvent, useState } from 'react';
import { AlertaEntidad } from '../../../dominio/entidades/alerta.entidad';
import { HistoriaAlertaEntidad } from '../../../dominio/entidades/historia-alerta.entidad';
import { FiltroAlertasDto } from '../../../aplicacion/dto/filtro-alertas.dto';

interface PropiedadesIncidenciasAdministrativasPagina {
  incidencias: AlertaEntidad[];
  historiaSeleccionada: HistoriaAlertaEntidad | null;
  alFiltrar: (filtros: FiltroAlertasDto) => Promise<void>;
  alSeleccionar: (id: string) => Promise<void>;
  alRegistrarProceso: (
    id: string,
    datos: {
      accionInstitucional: string;
      descripcionInicial: string;
      responsable?: string;
      fechaObjetivo?: string;
      estado: 'pendiente' | 'en_proceso' | 'completado';
    },
  ) => Promise<void>;
  alRegistrarAvance: (
    procesoId: string,
    datos: {
      descripcionAvance: string;
      tipo: 'avance' | 'resultado';
      estado: 'pendiente' | 'en_proceso' | 'completado';
    },
  ) => Promise<void>;
}

export function IncidenciasAdministrativasPagina({
  incidencias,
  historiaSeleccionada,
  alFiltrar,
  alSeleccionar,
  alRegistrarProceso,
  alRegistrarAvance,
}: PropiedadesIncidenciasAdministrativasPagina) {
  const [estado, setEstado] = useState('');
  const [riesgoMinimo, setRiesgoMinimo] = useState('');
  const [riesgoMaximo, setRiesgoMaximo] = useState('');
  const [accionInstitucional, setAccionInstitucional] = useState('');
  const [descripcionInicial, setDescripcionInicial] = useState('');
  const [responsable, setResponsable] = useState('');
  const [fechaObjetivo, setFechaObjetivo] = useState('');
  const [estadoProceso, setEstadoProceso] = useState<'pendiente' | 'en_proceso' | 'completado'>('pendiente');
  const [procesoActivoId, setProcesoActivoId] = useState('');
  const [descripcionAvance, setDescripcionAvance] = useState('');
  const [tipoAvance, setTipoAvance] = useState<'avance' | 'resultado'>('avance');
  const [estadoAvance, setEstadoAvance] = useState<'pendiente' | 'en_proceso' | 'completado'>('en_proceso');

  const aplicarFiltros = async (evento: FormEvent) => {
    evento.preventDefault();
    await alFiltrar({
      estado: estado as FiltroAlertasDto['estado'],
      riesgoMinimo: riesgoMinimo ? Number(riesgoMinimo) : undefined,
      riesgoMaximo: riesgoMaximo ? Number(riesgoMaximo) : undefined,
    });
  };

  const registrarProceso = async (evento: FormEvent) => {
    evento.preventDefault();
    if (!historiaSeleccionada) return;
    await alRegistrarProceso(historiaSeleccionada.alerta.id, {
      accionInstitucional,
      descripcionInicial,
      responsable: responsable || undefined,
      fechaObjetivo: fechaObjetivo || undefined,
      estado: estadoProceso,
    });
    setAccionInstitucional('');
    setDescripcionInicial('');
    setResponsable('');
    setFechaObjetivo('');
    setEstadoProceso('pendiente');
  };

  const registrarAvance = async (evento: FormEvent) => {
    evento.preventDefault();
    if (!procesoActivoId) return;
    await alRegistrarAvance(procesoActivoId, {
      descripcionAvance,
      tipo: tipoAvance,
      estado: estadoAvance,
    });
    setDescripcionAvance('');
    setTipoAvance('avance');
    setEstadoAvance('en_proceso');
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-6">
        <form onSubmit={aplicarFiltros} className="rounded-3xl bg-white p-6 shadow-panel">
          <h1 className="text-2xl font-black text-slate-800">Incidencias anonimas</h1>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <select
              value={estado}
              onChange={(evento) => setEstado(evento.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">pendiente</option>
              <option value="evaluacion">evaluacion</option>
              <option value="cerrada">cerrada</option>
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
          </div>
          <button
            type="submit"
            className="mt-6 rounded-2xl bg-marca-700 px-5 py-3 font-semibold text-white"
          >
            Filtrar incidencias
          </button>
        </form>

        <div className="rounded-3xl bg-white p-6 shadow-panel">
          <h2 className="text-2xl font-black text-slate-800">Listado institucional</h2>
          <div className="mt-6 space-y-4">
            {incidencias.map((incidencia) => (
              <article key={incidencia.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                      Caso {incidencia.estudianteId}
                    </p>
                    <p className="mt-3 text-3xl font-black text-marca-800">
                      Riesgo {incidencia.puntajeRiesgo}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">Estado: {incidencia.estado}</p>
                  </div>
                  <button
                    onClick={() => void alSeleccionar(incidencia.id)}
                    className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                  >
                    Ver proceso
                  </button>
                </div>
              </article>
            ))}
            {incidencias.length === 0 && (
              <p className="text-sm text-slate-500">No hay incidencias para los filtros aplicados.</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-panel">
        <h2 className="text-2xl font-black text-slate-800">Proceso institucional</h2>
        {!historiaSeleccionada && (
          <p className="mt-6 text-sm text-slate-500">
            Selecciona una incidencia para revisar las acciones sugeridas por psicologia y registrar su ejecucion.
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
                Estado clinico: {historiaSeleccionada.alerta.estado}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <h3 className="text-lg font-bold text-slate-800">Indicaciones del psicologo</h3>
              <div className="mt-4 space-y-3">
                {historiaSeleccionada.seguimientos.map((seguimiento) => (
                  <article key={seguimiento.id} className="rounded-2xl bg-white p-4">
                    <p className="font-semibold text-slate-800">{seguimiento.accionGlobal}</p>
                    <p className="mt-2 leading-7 text-slate-700">{seguimiento.descripcion}</p>
                    <p className="mt-3 text-sm text-slate-500">
                      {new Date(seguimiento.fechaCreacion).toLocaleString('es-PE')}
                    </p>
                  </article>
                ))}
                {historiaSeleccionada.seguimientos.length === 0 && (
                  <p className="text-sm text-slate-500">Aun no hay indicaciones del psicologo.</p>
                )}
              </div>
            </div>

            <form onSubmit={registrarProceso} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <h3 className="text-lg font-bold text-slate-800">Iniciar accion administrativa</h3>
              <input
                value={accionInstitucional}
                onChange={(evento) => setAccionInstitucional(evento.target.value)}
                placeholder="Accion institucional ejecutada"
                className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3"
                required
              />
              <textarea
                value={descripcionInicial}
                onChange={(evento) => setDescripcionInicial(evento.target.value)}
                placeholder="Describe el inicio: motivo, alcance, coordinaciones iniciales"
                className="mt-4 min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3"
                required
              />
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <input
                  value={responsable}
                  onChange={(evento) => setResponsable(evento.target.value)}
                  placeholder="Responsable institucional"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                />
                <input
                  type="date"
                  value={fechaObjetivo}
                  onChange={(evento) => setFechaObjetivo(evento.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                />
              </div>
              <select
                value={estadoProceso}
                onChange={(evento) =>
                  setEstadoProceso(
                    evento.target.value as 'pendiente' | 'en_proceso' | 'completado',
                  )
                }
                className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3"
              >
                <option value="pendiente">pendiente</option>
                <option value="en_proceso">en_proceso</option>
                <option value="completado">completado</option>
              </select>
              <button
                type="submit"
                className="mt-4 rounded-2xl bg-acento-500 px-5 py-3 font-semibold text-slate-900"
              >
                Crear proceso
              </button>
            </form>

            <div>
              <h3 className="text-lg font-bold text-slate-800">Historial administrativo</h3>
              <div className="mt-4 space-y-3">
                {historiaSeleccionada.procesosAdministrativos.map((proceso) => (
                  <article key={proceso.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="font-semibold text-slate-800">{proceso.accionInstitucional}</p>
                        <p className="mt-2 leading-7 text-slate-700">{proceso.descripcionInicial}</p>
                        {proceso.responsable && (
                          <p className="mt-3 text-sm text-slate-500">
                            Responsable: {proceso.responsable}
                          </p>
                        )}
                        {proceso.fechaObjetivo && (
                          <p className="mt-1 text-sm text-slate-500">
                            Fecha objetivo: {new Date(proceso.fechaObjetivo).toLocaleDateString('es-PE')}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setProcesoActivoId(proceso.id)}
                        className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                          procesoActivoId === proceso.id
                            ? 'bg-marca-700 text-white'
                            : 'bg-white text-slate-700'
                        }`}
                      >
                        {procesoActivoId === proceso.id ? 'Proceso activo' : 'Registrar avance'}
                      </button>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">
                      Estado: {proceso.estado} · inicio {new Date(proceso.fechaCreacion).toLocaleString('es-PE')} · actualizacion {new Date(proceso.fechaActualizacion).toLocaleString('es-PE')}
                    </p>
                    <div className="mt-4 space-y-3">
                      {proceso.avances.map((avance) => (
                        <article key={avance.id} className="rounded-2xl bg-white p-4">
                          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-marca-600">
                            {avance.tipo === 'resultado' ? 'Resultado posterior' : 'Avance'}
                          </p>
                          <p className="mt-2 leading-7 text-slate-700">{avance.descripcionAvance}</p>
                          <p className="mt-3 text-sm text-slate-500">
                            Estado: {avance.estado} · {new Date(avance.fechaCreacion).toLocaleString('es-PE')}
                          </p>
                        </article>
                      ))}
                      {proceso.avances.length === 0 && (
                        <p className="text-sm text-slate-500">
                          Aun no hay avances registrados para esta accion.
                        </p>
                      )}
                    </div>
                  </article>
                ))}
                {historiaSeleccionada.procesosAdministrativos.length === 0 && (
                  <p className="text-sm text-slate-500">Aun no hay proceso administrativo registrado.</p>
                )}
              </div>
            </div>

            {historiaSeleccionada.procesosAdministrativos.length > 0 && (
              <form onSubmit={registrarAvance} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <h3 className="text-lg font-bold text-slate-800">Registrar avance o resultado</h3>
                <select
                  value={procesoActivoId}
                  onChange={(evento) => setProcesoActivoId(evento.target.value)}
                  className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  required
                >
                  <option value="">Selecciona un proceso</option>
                  {historiaSeleccionada.procesosAdministrativos.map((proceso) => (
                    <option key={proceso.id} value={proceso.id}>
                      {proceso.accionInstitucional}
                    </option>
                  ))}
                </select>
                <textarea
                  value={descripcionAvance}
                  onChange={(evento) => setDescripcionAvance(evento.target.value)}
                  placeholder="Describe lo sucedido despues de la accion: ejecucion, asistencia, resultado o siguiente paso"
                  className="mt-4 min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  required
                />
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <select
                    value={tipoAvance}
                    onChange={(evento) =>
                      setTipoAvance(evento.target.value as 'avance' | 'resultado')
                    }
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  >
                    <option value="avance">avance</option>
                    <option value="resultado">resultado</option>
                  </select>
                  <select
                    value={estadoAvance}
                    onChange={(evento) =>
                      setEstadoAvance(
                        evento.target.value as 'pendiente' | 'en_proceso' | 'completado',
                      )
                    }
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  >
                    <option value="pendiente">pendiente</option>
                    <option value="en_proceso">en_proceso</option>
                    <option value="completado">completado</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white"
                >
                  Guardar avance
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
