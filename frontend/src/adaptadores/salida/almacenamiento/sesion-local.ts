import { SesionEntidad } from '../../../dominio/entidades/sesion.entidad';

const CLAVE_SESION = 'safeschool_sesion';

export class SesionLocal {
  guardar(sesion: SesionEntidad) {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  }

  obtener(): SesionEntidad | null {
    const valor = localStorage.getItem(CLAVE_SESION);
    return valor ? (JSON.parse(valor) as SesionEntidad) : null;
  }

  limpiar() {
    localStorage.removeItem(CLAVE_SESION);
  }
}
