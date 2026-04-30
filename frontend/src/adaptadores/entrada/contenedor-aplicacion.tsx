import { useEffect, useState } from 'react';
import { IniciarSesionServicio } from '../../aplicacion/casos-uso/iniciar-sesion.servicio';
import { FiltroAlertasDto } from '../../aplicacion/dto/filtro-alertas.dto';
import { GestionarAlertasServicio } from '../../aplicacion/casos-uso/gestionar-alertas.servicio';
import { GestionarIncidenciasAdministrativasServicio } from '../../aplicacion/casos-uso/gestionar-incidencias-administrativas.servicio';
import { GestionarEncuestasServicio } from '../../aplicacion/casos-uso/gestionar-encuestas.servicio';
import { ObtenerPanelServicio } from '../../aplicacion/casos-uso/obtener-panel.servicio';
import { ClienteApi } from '../salida/api/cliente-api';
import { SesionLocal } from '../salida/almacenamiento/sesion-local';
import { BarraNavegacion } from './componentes/barra-navegacion';
import { AlertasPagina } from './paginas/alertas.pagina';
import { EncuestaPagina } from './paginas/encuesta.pagina';
import { AlertaEntidad, EstadoAlerta } from '../../dominio/entidades/alerta.entidad';
import { EncuestaEmocionalEntidad } from '../../dominio/entidades/encuesta-emocional.entidad';
import { HistoriaAlertaEntidad } from '../../dominio/entidades/historia-alerta.entidad';
import { PanelEntidad } from '../../dominio/entidades/panel.entidad';
import { SesionEntidad } from '../../dominio/entidades/sesion.entidad';
import { InicioSesionPagina } from './paginas/inicio-sesion.pagina';
import { IncidenciasAdministrativasPagina } from './paginas/incidencias-administrativas.pagina';
import { PanelPagina } from './paginas/panel.pagina';

const clienteApi = new ClienteApi();
const iniciarSesion = new IniciarSesionServicio(clienteApi);
const gestionarIncidenciasAdministrativas =
  new GestionarIncidenciasAdministrativasServicio(clienteApi);
const gestionarEncuestas = new GestionarEncuestasServicio(clienteApi);
const gestionarAlertas = new GestionarAlertasServicio(clienteApi);
const obtenerPanel = new ObtenerPanelServicio(clienteApi);
const sesionLocal = new SesionLocal();

export function ContenedorAplicacion() {
  const [pestanaActiva, setPestanaActiva] = useState('encuestas');
  const [cargando, setCargando] = useState(true);
  const [sesion, setSesion] = useState<SesionEntidad | null>(sesionLocal.obtener());
  const [panel, setPanel] = useState<PanelEntidad | null>(null);
  const [encuestas, setEncuestas] = useState<EncuestaEmocionalEntidad[]>([]);
  const [alertas, setAlertas] = useState<AlertaEntidad[]>([]);
  const [filtrosAlerta, setFiltrosAlerta] = useState<FiltroAlertasDto>({});
  const [historiaAlerta, setHistoriaAlerta] = useState<HistoriaAlertaEntidad | null>(null);
  const [error, setError] = useState('');
  const [mostrarAccesoInterno, setMostrarAccesoInterno] = useState(false);

  const cargar = async () => {
    if (!sesion) {
      setPanel(null);
      setAlertas([]);
      setCargando(false);
      return;
    }

    setCargando(true);
    setError('');
    try {
      if (sesion.usuario.rol === 'administrativo') {
        const [panelActual, incidenciasActuales] = await Promise.all([
          obtenerPanel.ejecutar(),
          gestionarIncidenciasAdministrativas.listar(filtrosAlerta),
        ]);
        setPanel(panelActual);
        setAlertas(incidenciasActuales);
        setEncuestas([]);
      } else if (sesion.usuario.rol === 'psicologo') {
        const alertasActuales = await gestionarAlertas.listar(filtrosAlerta);
        setAlertas(alertasActuales);
        setPanel(null);
        setEncuestas([]);
      } else {
        setEncuestas([]);
        setPanel(null);
        setAlertas([]);
      }
    } catch (errorCapturado) {
      if (errorCapturado instanceof Error && errorCapturado.message.includes('401')) {
        localStorage.removeItem('safeschool_token');
        sesionLocal.limpiar();
        setSesion(null);
      }
      setError(
        errorCapturado instanceof Error
          ? errorCapturado.message
          : 'No fue posible cargar la informacion',
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (sesion?.tokenAcceso) {
      localStorage.setItem('safeschool_token', sesion.tokenAcceso);
    }
  }, [sesion]);

  useEffect(() => {
    void cargar();
  }, [sesion, filtrosAlerta]);

  const ejecutarInicioSesion = async (credenciales: {
    nombreUsuario: string;
    claveAcceso: string;
  }) => {
    setCargando(true);
    setError('');
    try {
      const sesionNueva = await iniciarSesion.ejecutar(credenciales);
      localStorage.setItem('safeschool_token', sesionNueva.tokenAcceso);
      sesionLocal.guardar(sesionNueva);
      setSesion(sesionNueva);
      setMostrarAccesoInterno(false);
      setPestanaActiva(
        sesionNueva.usuario.rol === 'administrativo'
          ? 'panel'
          : 'alertas',
      );
    } catch (errorCapturado) {
      setError(
        errorCapturado instanceof Error
          ? errorCapturado.message
          : 'No fue posible iniciar sesion',
      );
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('safeschool_token');
    sesionLocal.limpiar();
    setSesion(null);
    setPanel(null);
    setEncuestas([]);
    setAlertas([]);
    setHistoriaAlerta(null);
    setPestanaActiva('encuestas');
  };

  const registrarEncuesta = async (datos: {
    textoEmocional: string;
    nivelAnimo: number;
    nivelSeguridad: number;
  }) => {
    await gestionarEncuestas.registrar(datos);
    await cargar();
  };

  const actualizarAlerta = async (id: string, estado: EstadoAlerta) => {
    await gestionarAlertas.actualizar(id, { estado });
    if (historiaAlerta?.alerta.id === id) {
      setHistoriaAlerta(await gestionarAlertas.obtenerHistoria(id));
    }
    await cargar();
  };

  const aplicarFiltrosAlerta = async (filtros: FiltroAlertasDto) => {
    setFiltrosAlerta(filtros);
  };

  const seleccionarHistoriaAlerta = async (id: string) => {
    setHistoriaAlerta(await gestionarAlertas.obtenerHistoria(id));
  };

  const registrarSeguimientoAlerta = async (
    id: string,
    datos: { accionGlobal: string; descripcion: string },
  ) => {
    await gestionarAlertas.registrarSeguimiento(id, datos);
    setHistoriaAlerta(await gestionarAlertas.obtenerHistoria(id));
    await cargar();
  };

  const seleccionarHistoriaIncidenciaAdministrativa = async (id: string) => {
    setHistoriaAlerta(
      await gestionarIncidenciasAdministrativas.obtenerHistoria(id),
    );
  };

  const registrarProcesoAdministrativo = async (
    id: string,
    datos: {
      accionInstitucional: string;
      descripcionInicial: string;
      responsable?: string;
      fechaObjetivo?: string;
      estado: 'pendiente' | 'en_proceso' | 'completado';
    },
  ) => {
    await gestionarIncidenciasAdministrativas.registrarProceso(id, datos);
    setHistoriaAlerta(
      await gestionarIncidenciasAdministrativas.obtenerHistoria(id),
    );
    await cargar();
  };

  const registrarAvanceProcesoAdministrativo = async (
    procesoId: string,
    datos: {
      descripcionAvance: string;
      tipo: 'avance' | 'resultado';
      estado: 'pendiente' | 'en_proceso' | 'completado';
    },
  ) => {
    await gestionarIncidenciasAdministrativas.registrarAvance(procesoId, datos);
    if (historiaAlerta) {
      setHistoriaAlerta(
        await gestionarIncidenciasAdministrativas.obtenerHistoria(
          historiaAlerta.alerta.id,
        ),
      );
    }
    await cargar();
  };

  if (!sesion && mostrarAccesoInterno) {
    return (
      <>
        {error && (
          <div className="fixed left-4 top-4 z-50 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <InicioSesionPagina
          alIniciarSesion={ejecutarInicioSesion}
          cargando={cargando}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(83,170,157,0.18),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef7f6_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {sesion ? (
          <BarraNavegacion
            pestañaActiva={pestanaActiva}
            alCambiar={setPestanaActiva}
            rol={sesion.usuario.rol}
            nombreUsuario={sesion.usuario.nombreUsuario}
            alCerrarSesion={cerrarSesion}
          />
        ) : (
          <div className="flex items-center justify-between rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-panel backdrop-blur">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-marca-500">SafeSchool AI</p>
              <h1 className="mt-2 text-2xl font-black text-slate-900">Canal de reporte anonimo</h1>
            </div>
            <button
              onClick={() => setMostrarAccesoInterno(true)}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              Acceso interno
            </button>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <main className="mt-6">
          {!sesion && (
            <EncuestaPagina
              encuestas={[]}
              alRegistrar={registrarEncuesta}
            />
          )}
          {sesion?.usuario.rol === 'administrativo' && pestanaActiva === 'panel' && (
            <PanelPagina panel={panel} cargando={cargando} />
          )}
          {sesion?.usuario.rol === 'administrativo' && pestanaActiva === 'incidencias' && (
            <IncidenciasAdministrativasPagina
              incidencias={alertas}
              historiaSeleccionada={historiaAlerta}
              alFiltrar={aplicarFiltrosAlerta}
              alSeleccionar={seleccionarHistoriaIncidenciaAdministrativa}
              alRegistrarProceso={registrarProcesoAdministrativo}
              alRegistrarAvance={registrarAvanceProcesoAdministrativo}
            />
          )}
          {sesion?.usuario.rol === 'psicologo' && pestanaActiva === 'alertas' && (
            <AlertasPagina
              alertas={alertas}
              historiaSeleccionada={historiaAlerta}
              alFiltrar={aplicarFiltrosAlerta}
              alSeleccionar={seleccionarHistoriaAlerta}
              alActualizar={actualizarAlerta}
              alRegistrarSeguimiento={registrarSeguimientoAlerta}
            />
          )}
        </main>
      </div>
    </div>
  );
}
