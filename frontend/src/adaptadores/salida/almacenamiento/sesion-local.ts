import { SesionEntidad } from '../../../dominio/entidades/sesion.entidad';

const CLAVE_SESION = 'safeschool_sesion';

export class SesionLocal {
  guardar(sesion: SesionEntidad) {
    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  }

  obtener(): SesionEntidad | null {
    const valor = sessionStorage.getItem(CLAVE_SESION);
    return valor ? (JSON.parse(valor) as SesionEntidad) : null;
  }

  limpiar() {
    sessionStorage.removeItem(CLAVE_SESION);
  }
}
