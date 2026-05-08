import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { IniciarSesionDto } from "../../../../aplicacion/dto/iniciar-sesion.dto";
import { IniciarSesionCasoUso } from "../../../../aplicacion/puertos/entrada/iniciar-sesion.caso-uso";
import { ObtenerPerfilActualCasoUso } from "../../../../aplicacion/puertos/entrada/obtener-perfil-actual.caso-uso";
import { UsuarioActual } from "../decoradores/usuario-actual.decorador";
import { JwtGuard } from "../guardias/jwt.guard";
import { UsuarioAutenticadoDto } from "../../../../aplicacion/dto/usuario-autenticado.dto";

@Controller("autenticacion")
export class AutenticacionControlador {
  constructor(
    private readonly iniciarSesionCasoUso: IniciarSesionCasoUso,
    private readonly obtenerPerfilActualCasoUso: ObtenerPerfilActualCasoUso,
  ) {}

  @Post("iniciar-sesion")
  iniciarSesion(@Body() dto: IniciarSesionDto) {
    return this.iniciarSesionCasoUso.ejecutar(dto);
  }

  @UseGuards(JwtGuard)
  @Get("perfil")
  obtenerPerfil(@UsuarioActual() usuarioActual: UsuarioAutenticadoDto) {
    return this.obtenerPerfilActualCasoUso.ejecutar(usuarioActual);
  }
}
