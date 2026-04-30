import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AlertaOrmEntidad } from '../adaptadores/salida/persistencia/typeorm/entidades/alerta.orm-entidad';
import { AvanceProcesoAdministrativoOrmEntidad } from '../adaptadores/salida/persistencia/typeorm/entidades/avance-proceso-administrativo.orm-entidad';
import { EncuestaEmocionalOrmEntidad } from '../adaptadores/salida/persistencia/typeorm/entidades/encuesta-emocional.orm-entidad';
import { ProcesoAdministrativoOrmEntidad } from '../adaptadores/salida/persistencia/typeorm/entidades/proceso-administrativo.orm-entidad';
import { SeguimientoAlertaOrmEntidad } from '../adaptadores/salida/persistencia/typeorm/entidades/seguimiento-alerta.orm-entidad';
import { EstudianteOrmEntidad } from '../adaptadores/salida/persistencia/typeorm/entidades/estudiante.orm-entidad';
import { UsuarioOrmEntidad } from '../adaptadores/salida/persistencia/typeorm/entidades/usuario.orm-entidad';

export const obtenerConfiguracionBaseDatos = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.BASE_DATOS_HOST ?? 'localhost',
  port: Number(process.env.BASE_DATOS_PUERTO ?? 5432),
  username: process.env.BASE_DATOS_USUARIO ?? 'postgres',
  password: process.env.BASE_DATOS_CLAVE ?? 'postgres',
  database: process.env.BASE_DATOS_NOMBRE ?? 'safeschool_ai',
  entities: [
    UsuarioOrmEntidad,
    EstudianteOrmEntidad,
    EncuestaEmocionalOrmEntidad,
    AlertaOrmEntidad,
    ProcesoAdministrativoOrmEntidad,
    AvanceProcesoAdministrativoOrmEntidad,
    SeguimientoAlertaOrmEntidad,
  ],
  synchronize: true,
});
