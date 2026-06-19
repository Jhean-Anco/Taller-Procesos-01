import { FiltroAlertasDto } from "../../../aplicacion/dto/filtro-alertas.dto";
import { IniciarSesionDto } from "../../../aplicacion/dto/iniciar-sesion.dto";
import { RegistrarAvanceProcesoAdministrativoDto } from "../../../aplicacion/dto/registrar-avance-proceso-administrativo.dto";
import { RegistrarProcesoAdministrativoDto } from "../../../aplicacion/dto/registrar-proceso-administrativo.dto";
import { RegistrarSeguimientoAlertaDto } from "../../../aplicacion/dto/registrar-seguimiento-alerta.dto";
import { ActualizarAlertaDto } from "../../../aplicacion/dto/actualizar-alerta.dto";
import { RegistrarEncuestaDto } from "../../../aplicacion/dto/registrar-encuesta.dto";
import { ClienteApiPuerto } from "../../../aplicacion/puertos/salida/cliente-api.puerto";
import { AlertaEntidad } from "../../../dominio/entidades/alerta.entidad";
import { AvanceProcesoAdministrativoEntidad } from "../../../dominio/entidades/avance-proceso-administrativo.entidad";
import { EncuestaEmocionalEntidad } from "../../../dominio/entidades/encuesta-emocional.entidad";
import { HistoriaAlertaEntidad } from "../../../dominio/entidades/historia-alerta.entidad";
import { PanelEntidad } from "../../../dominio/entidades/panel.entidad";
import { ProcesoAdministrativoEntidad } from "../../../dominio/entidades/proceso-administrativo.entidad";
import { SesionEntidad } from "../../../dominio/entidades/sesion.entidad";
import { SeguimientoAlertaEntidad } from "../../../dominio/entidades/seguimiento-alerta.entidad";
import { SesionLocal } from "../almacenamiento/sesion-local";

export class ClienteApi implements ClienteApiPuerto {
  private readonly baseUrl =
    import.meta.env.VITE_API_URL ?? "http://localhost:3000";
  private readonly sesionLocal = new SesionLocal();

  private async solicitar<T>(ruta: string, opciones?: RequestInit): Promise<T> {
    const sesionPersistida = this.sesionLocal.obtener();
    const token = sesionPersistida?.tokenAcceso ?? null;
    const encabezadosBase: Record<string, string> = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const respuesta = await fetch(`${this.baseUrl}${ruta}`, {
      ...opciones,
      headers: {
        ...encabezadosBase,
        ...(opciones?.headers ?? {}),
      },
    });

    if (!respuesta.ok) {
      const texto = await respuesta.text();
      throw new Error(texto || `Error HTTP ${respuesta.status}`);
    }

    return respuesta.json() as Promise<T>;
  }

  async iniciarSesion(dto: IniciarSesionDto): Promise<SesionEntidad> {
    return this.solicitar("/autenticacion/iniciar-sesion", {
      method: "POST",
      body: JSON.stringify({
        nombreUsuario: dto.nombreUsuario,
        claveAcceso: dto.claveAcceso,
      }),
    });
  }

  obtenerPerfilActual(): Promise<SesionEntidad["usuario"]> {
    return this.solicitar("/autenticacion/perfil");
  }

  registrarEncuesta(
    dto: RegistrarEncuestaDto,
  ): Promise<EncuestaEmocionalEntidad> {
    return this.solicitar("/encuestas", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  }

  listarEncuestas(): Promise<EncuestaEmocionalEntidad[]> {
    return this.solicitar("/encuestas");
  }

  listarAlertas(filtros?: FiltroAlertasDto): Promise<AlertaEntidad[]> {
    const parametros = new URLSearchParams();
    if (filtros?.estado) parametros.set("estado", filtros.estado);
    if (typeof filtros?.riesgoMinimo === "number") {
      parametros.set("riesgoMinimo", String(filtros.riesgoMinimo));
    }
    if (typeof filtros?.riesgoMaximo === "number") {
      parametros.set("riesgoMaximo", String(filtros.riesgoMaximo));
    }
    if (filtros?.fechaDesde) parametros.set("fechaDesde", filtros.fechaDesde);
    if (filtros?.fechaHasta) parametros.set("fechaHasta", filtros.fechaHasta);
    const sufijo = parametros.toString() ? `?${parametros.toString()}` : "";
    return this.solicitar(`/alertas${sufijo}`);
  }

  obtenerHistoriaAlerta(id: string): Promise<HistoriaAlertaEntidad> {
    return this.solicitar(`/alertas/${id}`);
  }

  actualizarAlerta(
    id: string,
    dto: ActualizarAlertaDto,
  ): Promise<AlertaEntidad> {
    return this.solicitar(`/alertas/${id}`, {
      method: "PATCH",
      body: JSON.stringify(dto),
    });
  }

  registrarSeguimientoAlerta(
    id: string,
    dto: RegistrarSeguimientoAlertaDto,
  ): Promise<SeguimientoAlertaEntidad> {
    return this.solicitar(`/alertas/${id}/seguimientos`, {
      method: "POST",
      body: JSON.stringify(dto),
    });
  }

  listarIncidenciasAdministrativas(
    filtros?: FiltroAlertasDto,
  ): Promise<AlertaEntidad[]> {
    const parametros = new URLSearchParams();
    if (filtros?.estado) parametros.set("estado", filtros.estado);
    if (typeof filtros?.riesgoMinimo === "number") {
      parametros.set("riesgoMinimo", String(filtros.riesgoMinimo));
    }
    if (typeof filtros?.riesgoMaximo === "number") {
      parametros.set("riesgoMaximo", String(filtros.riesgoMaximo));
    }
    if (filtros?.fechaDesde) parametros.set("fechaDesde", filtros.fechaDesde);
    if (filtros?.fechaHasta) parametros.set("fechaHasta", filtros.fechaHasta);
    const sufijo = parametros.toString() ? `?${parametros.toString()}` : "";
    return this.solicitar(`/administracion/incidencias${sufijo}`);
  }

  obtenerHistoriaIncidenciaAdministrativa(
    id: string,
  ): Promise<HistoriaAlertaEntidad> {
    return this.solicitar(`/administracion/incidencias/${id}`);
  }

  registrarProcesoAdministrativo(
    id: string,
    dto: RegistrarProcesoAdministrativoDto,
  ): Promise<ProcesoAdministrativoEntidad> {
    return this.solicitar(`/administracion/incidencias/${id}/procesos`, {
      method: "POST",
      body: JSON.stringify(dto),
    });
  }

  registrarAvanceProcesoAdministrativo(
    procesoId: string,
    dto: RegistrarAvanceProcesoAdministrativoDto,
  ): Promise<AvanceProcesoAdministrativoEntidad> {
    return this.solicitar(
      `/administracion/incidencias/procesos/${procesoId}/avances`,
      {
        method: "POST",
        body: JSON.stringify(dto),
      },
    );
  }

  obtenerPanel(): Promise<PanelEntidad> {
    return this.solicitar("/dashboard");
  }
}
