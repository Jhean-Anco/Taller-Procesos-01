import { FormEvent, useState } from 'react';
import { EncuestaEmocionalEntidad } from '../../../dominio/entidades/encuesta-emocional.entidad';

interface PropiedadesEncuestaPagina {
  encuestas: EncuestaEmocionalEntidad[];
  alRegistrar: (datos: {
    textoEmocional: string;
    nivelAnimo: number;
    nivelSeguridad: number;
  }) => Promise<void>;
}

export function EncuestaPagina({
  encuestas,
  alRegistrar,
}: PropiedadesEncuestaPagina) {
  const [textoEmocional, setTextoEmocional] = useState('');
  const [nivelAnimo, setNivelAnimo] = useState(3);
  const [nivelSeguridad, setNivelSeguridad] = useState(3);

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault();
    await alRegistrar({
      textoEmocional,
      nivelAnimo,
      nivelSeguridad,
    });
    setTextoEmocional('');
    setNivelAnimo(3);
    setNivelSeguridad(3);
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
        </div>

        <button
          type="submit"
          className="mt-6 rounded-2xl bg-acento-500 px-5 py-3 font-semibold text-slate-900"
        >
          Enviar reporte
        </button>
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
