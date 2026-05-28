import { FormEvent, useState } from 'react';

interface PropiedadesInicioSesionPagina {
  alIniciarSesion: (credenciales: {
    nombreUsuario: string;
    claveAcceso: string;
  }) => Promise<void>;
  cargando: boolean;
}

export function InicioSesionPagina({
  alIniciarSesion,
  cargando,
}: PropiedadesInicioSesionPagina) {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [claveAcceso, setClaveAcceso] = useState('');

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault();
    await alIniciarSesion({ nombreUsuario, claveAcceso });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(83,170,157,0.22),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef7f6_100%)] px-4">
      <form onSubmit={enviar} className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-panel">
        <p className="text-sm uppercase tracking-[0.3em] text-marca-500">SafeSchool AI</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Iniciar sesión</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          Usa tu usuario seudónimo y tu clave de acceso.
        </p>

        <input
          value={nombreUsuario}
          onChange={(evento) => setNombreUsuario(evento.target.value)}
          placeholder="Usuario"
          className="mt-6 w-full rounded-2xl border border-slate-200 px-4 py-3"
          required
        />
        <input
          type="password"
          value={claveAcceso}
          onChange={(evento) => setClaveAcceso(evento.target.value)}
          placeholder="Clave de acceso"
          className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3"
          required
        />

        <button
          type="submit"
          disabled={cargando}
          className="mt-6 w-full rounded-2xl bg-marca-700 px-5 py-3 font-semibold text-white"
        >
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Psicología: <strong>psicologo@agora.edu.pe</strong> / <strong>psicolog2024</strong><br />
          Administración: <strong>admin@agora.edu.pe</strong> / <strong>admin2024</strong>
        </div>
      </form>
    </div>
  );
}
