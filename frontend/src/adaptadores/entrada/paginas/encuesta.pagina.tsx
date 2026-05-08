import { FormEvent, useState } from 'react';
import { RegistrarEncuestaDto } from '../../../aplicacion/dto/registrar-encuesta.dto';
import { EncuestaEmocionalEntidad } from '../../../dominio/entidades/encuesta-emocional.entidad';

interface PropiedadesEncuestaPagina {
  encuestas: EncuestaEmocionalEntidad[];
  alRegistrar: (datos: RegistrarEncuestaDto) => Promise<void>;
}

export function EncuestaPagina({
  encuestas,
  alRegistrar,
}: PropiedadesEncuestaPagina) {
  const [textoEmocional, setTextoEmocional] = useState('');
  const [nivelAnimo, setNivelAnimo] = useState(3);
  const [nivelSeguridad, setNivelSeguridad] = useState(3);
  const [grado, setGrado] = useState(1);
  const [zonaJunin, setZonaJunin] = useState(1);
  const [recreoSolo, setRecreoSolo] = useState(0);
  const [miedoParticipar, setMiedoParticipar] = useState(0);
  const [redesSociales, setRedesSociales] = useState(0);
  const [apoyoFamiliar, setApoyoFamiliar] = useState(1);
  const [rendimiento, setRendimiento] = useState(0);
  const [habilidadesSociales, setHabilidadesSociales] = useState(1);
  const [entornoViolento, setEntornoViolento] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [confirmacion, setConfirmacion] = useState('');

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault();
    setEnviando(true);
    setConfirmacion('');
    try {
      await alRegistrar({
        textoEmocional,
        nivelAnimo,
        nivelSeguridad,
        grado,
        zonaJunin,
        recreoSolo,
        miedoParticipar,
        redesSociales,
        apoyoFamiliar,
        rendimiento,
        habilidadesSociales,
        entornoViolento,
      });
      setTextoEmocional('');
      setNivelAnimo(3);
      setNivelSeguridad(3);
      setGrado(1);
      setZonaJunin(1);
      setRecreoSolo(0);
      setMiedoParticipar(0);
      setRedesSociales(0);
      setApoyoFamiliar(1);
      setRendimiento(0);
      setHabilidadesSociales(1);
      setEntornoViolento(0);
      setConfirmacion('Reporte anonimo registrado.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <form onSubmit={enviar} className="rounded-3xl bg-white p-6 shadow-panel">
        <h1 className="text-2xl font-black text-slate-800">Reporte anonimo</h1>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          Cualquier estudiante puede reportar sin crear una cuenta. El sistema genera
          un codigo anonimo interno automaticamente.
        </p>
        <div className="mt-6 grid gap-4">
          <textarea
            value={textoEmocional}
            onChange={(evento) => setTextoEmocional(evento.target.value)}
            className="min-h-36 rounded-2xl border border-slate-200 px-4 py-3"
            placeholder="Describe como te has sentido ultimamente"
            required
          />
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Relato protegido como caso anonimo</span>
            <span>{textoEmocional.trim().length} caracteres</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              Grado
              <select
                value={grado}
                onChange={(evento) => setGrado(Number(evento.target.value))}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              >
                <option value={0}>Primaria</option>
                <option value={1}>Secundaria</option>
              </select>
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Zona Junin
              <select
                value={zonaJunin}
                onChange={(evento) => setZonaJunin(Number(evento.target.value))}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              >
                <option value={0}>Rural</option>
                <option value={1}>Urbana</option>
              </select>
            </label>
          </div>

          <label className="text-sm font-semibold text-slate-700">
            Nivel de animo: {nivelAnimo}
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={nivelAnimo}
            onChange={(evento) => setNivelAnimo(Number(evento.target.value))}
          />

          <label className="text-sm font-semibold text-slate-700">
            Nivel de seguridad: {nivelSeguridad}
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={nivelSeguridad}
            onChange={(evento) => setNivelSeguridad(Number(evento.target.value))}
          />

          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={recreoSolo === 1}
                onChange={(evento) => setRecreoSolo(evento.target.checked ? 1 : 0)}
              />
              Suele estar solo en recreo
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={miedoParticipar === 1}
                onChange={(evento) =>
                  setMiedoParticipar(evento.target.checked ? 1 : 0)
                }
              />
              Tiene miedo de participar
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={redesSociales === 1}
                onChange={(evento) => setRedesSociales(evento.target.checked ? 1 : 0)}
              />
              Riesgo en redes sociales
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={apoyoFamiliar === 1}
                onChange={(evento) => setApoyoFamiliar(evento.target.checked ? 1 : 0)}
              />
              Cuenta con apoyo familiar
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={rendimiento === 1}
                onChange={(evento) => setRendimiento(evento.target.checked ? 1 : 0)}
              />
              Rendimiento bajo reciente
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={habilidadesSociales === 1}
                onChange={(evento) =>
                  setHabilidadesSociales(evento.target.checked ? 1 : 0)
                }
              />
              Habilidades sociales adecuadas
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 md:col-span-2">
              <input
                type="checkbox"
                checked={entornoViolento === 1}
                onChange={(evento) =>
                  setEntornoViolento(evento.target.checked ? 1 : 0)
                }
              />
              Ha visto o sufrido violencia en su entorno
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={enviando || textoEmocional.trim().length < 10}
          className="mt-6 rounded-2xl bg-acento-500 px-5 py-3 font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {enviando ? 'Enviando...' : 'Enviar reporte'}
        </button>
        {confirmacion && (
          <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            {confirmacion}
          </p>
        )}
      </form>

      <article className="rounded-3xl bg-white p-6 shadow-panel">
        <h2 className="text-2xl font-black text-slate-800">Vista de ejemplo</h2>
        <div className="mt-6 space-y-3">
          {encuestas.map((encuesta) => (
            <div key={encuesta.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">{encuesta.estudianteId}</p>
              <p className="mt-2 text-slate-800">{encuesta.textoEmocional}</p>
              <p className="mt-3 text-sm text-slate-500">
                Animo {encuesta.nivelAnimo} / Seguridad {encuesta.nivelSeguridad}
              </p>
              {typeof encuesta.puntajeRiesgo === 'number' && (
                <p className="mt-1 text-sm font-semibold text-marca-700">
                  Puntaje IA {encuesta.puntajeRiesgo}
                </p>
              )}
            </div>
          ))}
          {encuestas.length === 0 && (
            <p className="text-sm text-slate-500">
              Los reportes anonimos no muestran historial publico.
            </p>
          )}
        </div>
      </article>
    </section>
  );
}
