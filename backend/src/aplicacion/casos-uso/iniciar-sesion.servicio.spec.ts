import { UsuarioEntidad } from '../../dominio/entidades/usuario.entidad';
import { AutorizadorUsuarioServicio } from '../../dominio/servicios/autorizador-usuario.servicio';
import { IniciarSesionServicio } from './iniciar-sesion.servicio';
import { CifradorClavePuerto } from '../puertos/salida/cifrador-clave.puerto';
import { EmisorTokenPuerto } from '../puertos/salida/emisor-token.puerto';
import { RepositorioUsuarioPuerto } from '../puertos/salida/repositorio-usuario.puerto';

class RepositorioUsuarioMemoria implements RepositorioUsuarioPuerto {
  async guardar(usuario: UsuarioEntidad): Promise<UsuarioEntidad> {
    return usuario;
  }

  async obtenerPorNombreUsuario(nombreUsuario: string): Promise<UsuarioEntidad | null> {
    return new UsuarioEntidad(
      'usuario-1',
      nombreUsuario,
      'hash-falso',
      'estudiante_anonimo',
      true,
      new Date(),
      'estudiante-1',
    );
  }

  async obtenerPorId(): Promise<UsuarioEntidad | null> {
    return null;
  }

  async existePorNombreUsuario(): Promise<boolean> {
    return false;
  }
}

class CifradorClaveMemoria implements CifradorClavePuerto {
  async generarHash(textoPlano: string): Promise<string> {
    return textoPlano;
  }

  async comparar(textoPlano: string): Promise<boolean> {
    return textoPlano === 'clave123';
  }
}

class EmisorTokenMemoria implements EmisorTokenPuerto {
  async emitirTokenAcceso(): Promise<string> {
    return 'token-simulacion';
  }
}

describe('IniciarSesionServicio', () => {
  it('retorna token cuando las credenciales son validas', async () => {
    const servicio = new IniciarSesionServicio(
      new RepositorioUsuarioMemoria(),
      new CifradorClaveMemoria(),
      new EmisorTokenMemoria(),
      new AutorizadorUsuarioServicio(),
    );

    const respuesta = await servicio.ejecutar({
      nombreUsuario: 'est-001',
      claveAcceso: 'clave123',
    });

    expect(respuesta.tokenAcceso).toBe('token-simulacion');
    expect(respuesta.usuario.rol).toBe('estudiante_anonimo');
    expect(respuesta.usuario.estudianteId).toBe('estudiante-1');
  });
});
