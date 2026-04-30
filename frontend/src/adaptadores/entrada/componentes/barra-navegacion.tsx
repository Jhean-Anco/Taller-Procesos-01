import { RolUsuario } from '../../../dominio/entidades/sesion.entidad';

interface PropiedadesBarraNavegacion {
  pestañaActiva: string;
  alCambiar: (pestaña: string) => void;
  rol: RolUsuario;
  nombreUsuario: string;
  alCerrarSesion: () => void;
}

export function BarraNavegacion({
  pestañaActiva,
  alCambiar,
  rol,
  nombreUsuario,
  alCerrarSesion,
}: PropiedadesBarraNavegacion) {
  const opciones =
    rol === 'administrativo'
      ? [
          { id: 'panel', etiqueta: 'Panel' },
          { id: 'incidencias', etiqueta: 'Incidencias' },
        ]
      : [{ id: 'alertas', etiqueta: 'Alertas' }];

  return (
    <nav className="rounded-[2rem] border border-white/70 bg-white/80 p-3 shadow-panel backdrop-blur">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {opciones.map((opcion) => (
            <button
              key={opcion.id}
              onClick={() => alCambiar(opcion.id)}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                pestañaActiva === opcion.id
                  ? 'bg-marca-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opcion.etiqueta}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
            {nombreUsuario} · {rol}
          </div>
          <button
            onClick={alCerrarSesion}
            className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          >
            Cerrar sesion
          </button>
        </div>
      </div>
    </nav>
  );
}
