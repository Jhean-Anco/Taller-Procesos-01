import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IniciarSesionServicio } from '../aplicacion/casos-uso/iniciar-sesion.servicio';
import { IncidenciasAdministrativasServicio } from '../aplicacion/casos-uso/incidencias-administrativas.servicio';
import { ObtenerPerfilActualServicio } from '../aplicacion/casos-uso/obtener-perfil-actual.servicio';
import { RegistrarEncuestaServicio } from '../aplicacion/casos-uso/registrar-encuesta.servicio';
import { PanelServicio } from '../aplicacion/casos-uso/panel.servicio';
import { AlertaServicio } from '../aplicacion/casos-uso/alerta.servicio';
import { GestionarIncidenciasAdministrativasCasoUso } from '../aplicacion/puertos/entrada/gestionar-incidencias-administrativas.caso-uso';
import { ObtenerPerfilActualCasoUso } from '../aplicacion/puertos/entrada/obtener-perfil-actual.caso-uso';
import { IniciarSesionCasoUso } from '../aplicacion/puertos/entrada/iniciar-sesion.caso-uso';
import { RegistrarEncuestaCasoUso } from '../aplicacion/puertos/entrada/registrar-encuesta.caso-uso';
import { GestionarAlertasCasoUso } from '../aplicacion/puertos/entrada/gestionar-alertas.caso-uso';
import { ObtenerPanelCasoUso } from '../aplicacion/puertos/entrada/obtener-panel.caso-uso';
import { RepositorioAvanceProcesoAdministrativoPuerto } from '../aplicacion/puertos/salida/repositorio-avance-proceso-administrativo.puerto';
import { CifradorClavePuerto } from '../aplicacion/puertos/salida/cifrador-clave.puerto';
import { EvaluadorRiesgoIaPuerto } from '../aplicacion/puertos/salida/evaluador-riesgo-ia.puerto';
import { EmisorTokenPuerto } from '../aplicacion/puertos/salida/emisor-token.puerto';
import { RepositorioEstudiantePuerto } from '../aplicacion/puertos/salida/repositorio-estudiante.puerto';
import { RepositorioEncuestaPuerto } from '../aplicacion/puertos/salida/repositorio-encuesta.puerto';
import { RepositorioAlertaPuerto } from '../aplicacion/puertos/salida/repositorio-alerta.puerto';
import { RepositorioSeguimientoAlertaPuerto } from '../aplicacion/puertos/salida/repositorio-seguimiento-alerta.puerto';
import { RepositorioProcesoAdministrativoPuerto } from '../aplicacion/puertos/salida/repositorio-proceso-administrativo.puerto';
import { RepositorioUsuarioPuerto } from '../aplicacion/puertos/salida/repositorio-usuario.puerto';
import { AutenticacionControlador } from '../adaptadores/entrada/http/controladores/autenticacion.controlador';
import { IncidenciasAdministrativasControlador } from '../adaptadores/entrada/http/controladores/incidencias-administrativas.controlador';
import { CalculadorRiesgoServicio } from '../dominio/servicios/calculador-riesgo.servicio';
import { AutorizadorUsuarioServicio } from '../dominio/servicios/autorizador-usuario.servicio';
import { AlertaControlador } from '../adaptadores/entrada/http/controladores/alerta.controlador';
import { EncuestaControlador } from '../adaptadores/entrada/http/controladores/encuesta.controlador';
import { PanelControlador } from '../adaptadores/entrada/http/controladores/panel.controlador';
import { AlertaOrmEntidad } from '../adaptadores/salida/persistencia/typeorm/entidades/alerta.orm-entidad';
import { AvanceProcesoAdministrativoOrmEntidad } from '../adaptadores/salida/persistencia/typeorm/entidades/avance-proceso-administrativo.orm-entidad';
import { EncuestaEmocionalOrmEntidad } from '../adaptadores/salida/persistencia/typeorm/entidades/encuesta-emocional.orm-entidad';
import { ProcesoAdministrativoOrmEntidad } from '../adaptadores/salida/persistencia/typeorm/entidades/proceso-administrativo.orm-entidad';
import { SeguimientoAlertaOrmEntidad } from '../adaptadores/salida/persistencia/typeorm/entidades/seguimiento-alerta.orm-entidad';
import { EstudianteOrmEntidad } from '../adaptadores/salida/persistencia/typeorm/entidades/estudiante.orm-entidad';
import { UsuarioOrmEntidad } from '../adaptadores/salida/persistencia/typeorm/entidades/usuario.orm-entidad';
import { RepositorioAlertaTypeorm } from '../adaptadores/salida/persistencia/typeorm/repositorios/repositorio-alerta.typeorm';
import { RepositorioAvanceProcesoAdministrativoTypeorm } from '../adaptadores/salida/persistencia/typeorm/repositorios/repositorio-avance-proceso-administrativo.typeorm';
import { RepositorioEncuestaTypeorm } from '../adaptadores/salida/persistencia/typeorm/repositorios/repositorio-encuesta.typeorm';
import { RepositorioEstudianteTypeorm } from '../adaptadores/salida/persistencia/typeorm/repositorios/repositorio-estudiante.typeorm';
import { RepositorioProcesoAdministrativoTypeorm } from '../adaptadores/salida/persistencia/typeorm/repositorios/repositorio-proceso-administrativo.typeorm';
import { RepositorioSeguimientoAlertaTypeorm } from '../adaptadores/salida/persistencia/typeorm/repositorios/repositorio-seguimiento-alerta.typeorm';
import { RepositorioUsuarioTypeorm } from '../adaptadores/salida/persistencia/typeorm/repositorios/repositorio-usuario.typeorm';
import { BcryptCifradorClaveAdaptador } from '../adaptadores/salida/seguridad/bcrypt-cifrador-clave.adaptador';
import { ClienteServicioIaAdaptador } from '../adaptadores/salida/ia/cliente-servicio-ia.adaptador';
import { JwtEmisorTokenAdaptador } from '../adaptadores/salida/seguridad/jwt-emisor-token.adaptador';
import { JwtEstrategia } from '../adaptadores/entrada/http/estrategias/jwt.estrategia';
import { RolesGuard } from '../adaptadores/entrada/http/guardias/roles.guard';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRETO') ??
          'clave_super_segura_cambiar_en_produccion',
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRACION') ??
            '1d') as never,
        },
      }),
    }),
    TypeOrmModule.forFeature([
      UsuarioOrmEntidad,
      EstudianteOrmEntidad,
      EncuestaEmocionalOrmEntidad,
      AlertaOrmEntidad,
      ProcesoAdministrativoOrmEntidad,
      AvanceProcesoAdministrativoOrmEntidad,
      SeguimientoAlertaOrmEntidad,
    ]),
  ],
  controllers: [
    AutenticacionControlador,
    IncidenciasAdministrativasControlador,
    EncuestaControlador,
    AlertaControlador,
    PanelControlador,
  ],
  providers: [
    CalculadorRiesgoServicio,
    AutorizadorUsuarioServicio,
    IniciarSesionServicio,
    IncidenciasAdministrativasServicio,
    ObtenerPerfilActualServicio,
    RegistrarEncuestaServicio,
    PanelServicio,
    AlertaServicio,
    JwtEstrategia,
    RolesGuard,
    {
      provide: IniciarSesionCasoUso,
      useExisting: IniciarSesionServicio,
    },
    {
      provide: GestionarIncidenciasAdministrativasCasoUso,
      useExisting: IncidenciasAdministrativasServicio,
    },
    {
      provide: ObtenerPerfilActualCasoUso,
      useExisting: ObtenerPerfilActualServicio,
    },
    {
      provide: RegistrarEncuestaCasoUso,
      useExisting: RegistrarEncuestaServicio,
    },
    {
      provide: GestionarAlertasCasoUso,
      useExisting: AlertaServicio,
    },
    {
      provide: ObtenerPanelCasoUso,
      useExisting: PanelServicio,
    },
    {
      provide: RepositorioEstudiantePuerto,
      useClass: RepositorioEstudianteTypeorm,
    },
    {
      provide: RepositorioUsuarioPuerto,
      useClass: RepositorioUsuarioTypeorm,
    },
    {
      provide: RepositorioEncuestaPuerto,
      useClass: RepositorioEncuestaTypeorm,
    },
    {
      provide: RepositorioAlertaPuerto,
      useClass: RepositorioAlertaTypeorm,
    },
    {
      provide: RepositorioSeguimientoAlertaPuerto,
      useClass: RepositorioSeguimientoAlertaTypeorm,
    },
    {
      provide: RepositorioProcesoAdministrativoPuerto,
      useClass: RepositorioProcesoAdministrativoTypeorm,
    },
    {
      provide: RepositorioAvanceProcesoAdministrativoPuerto,
      useClass: RepositorioAvanceProcesoAdministrativoTypeorm,
    },
    {
      provide: EvaluadorRiesgoIaPuerto,
      useClass: ClienteServicioIaAdaptador,
    },
    {
      provide: CifradorClavePuerto,
      useClass: BcryptCifradorClaveAdaptador,
    },
    {
      provide: EmisorTokenPuerto,
      useClass: JwtEmisorTokenAdaptador,
    },
  ],
})
export class InyeccionDependenciasModulo {}
