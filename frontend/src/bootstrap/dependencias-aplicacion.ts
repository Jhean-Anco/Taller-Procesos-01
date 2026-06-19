import { ClienteApi } from "../adaptadores/salida/api/cliente-api";
import { SesionLocal } from "../adaptadores/salida/almacenamiento/sesion-local";
import { GestionarAlertasServicio } from "../aplicacion/casos-uso/gestionar-alertas.servicio";
import { GestionarEncuestasServicio } from "../aplicacion/casos-uso/gestionar-encuestas.servicio";
import { GestionarIncidenciasAdministrativasServicio } from "../aplicacion/casos-uso/gestionar-incidencias-administrativas.servicio";
import { IniciarSesionServicio } from "../aplicacion/casos-uso/iniciar-sesion.servicio";
import { ObtenerPanelServicio } from "../aplicacion/casos-uso/obtener-panel.servicio";

const clienteApi = new ClienteApi();
const sesionLocal = new SesionLocal();

export const dependenciasAplicacion = {
  clienteApi,
  sesionLocal,
  iniciarSesion: new IniciarSesionServicio(clienteApi),
  gestionarIncidenciasAdministrativas:
    new GestionarIncidenciasAdministrativasServicio(clienteApi),
  gestionarEncuestas: new GestionarEncuestasServicio(clienteApi),
  gestionarAlertas: new GestionarAlertasServicio(clienteApi),
  obtenerPanel: new ObtenerPanelServicio(clienteApi),
};
