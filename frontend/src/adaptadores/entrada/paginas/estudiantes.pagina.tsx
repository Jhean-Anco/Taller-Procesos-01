import { FormEvent, useState } from 'react';
import { EstudianteEntidad } from '../../../dominio/entidades/estudiante.entidad';

interface PropiedadesEstudiantesPagina {
  estudiantes: EstudianteEntidad[];
  alRegistrar: (codigoAnonimo: string) => Promise<void>;
}

export function EstudiantesPagina({
  estudiantes,
  alRegistrar,
}: PropiedadesEstudiantesPagina) {
  const [codigoAnonimo, setCodigoAnonimo] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault();
    setEnviando(true);
    try {
      await alRegistrar(codigoAnonimo);
      setCodigoAnonimo('');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <form onSubmit={enviar} className="rounded-3xl bg-white p-6 shadow-panel">
        <h1 className="text-2xl font-black text-slate-800">Registrar estudiante</h1>
        <p className="mt-2 text-sm text-slate-500">
          El sistema solo registra codigo anonimo para reducir exposicion de identidad.
        </p>
        <label className="mt-6 block text-sm font-semibold text-slate-700">
          Codigo anonimo
        </label>
        <input
          value={codigoAnonimo}
          onChange={(evento) => setCodigoAnonimo(evento.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-0 transition focus:border-marca-400"
          placeholder="Ejemplo: EST-001"
          required
        />
        <button
          type="submit"
          disabled={enviando}
          className="mt-6 rounded-2xl bg-marca-700 px-5 py-3 font-semibold text-white transition hover:bg-marca-800 disabled:opacity-60"
        >
          {enviando ? 'Registrando...' : 'Registrar'}
        </button>
      </form>

      <article className="rounded-3xl bg-white p-6 shadow-panel">
        <h2 className="text-2xl font-black text-slate-800">Listado de estudiantes</h2>
        <div className="mt-6 space-y-3">
          {estudiantes.map((estudiante) => (
            <div
              key={estudiante.id}
              className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4"
            >
              <p className="font-semibold text-slate-800">{estudiante.codigoAnonimo}</p>
              <p className="mt-1 text-sm text-slate-500">
                Creado: {new Date(estudiante.fechaCreacion).toLocaleString('es-PE')}
              </p>
            </div>
          ))}
          {estudiantes.length === 0 && (
            <p className="text-sm text-slate-500">Aun no hay estudiantes registrados.</p>
          )}
        </div>
      </article>
    </section>
  );
}
