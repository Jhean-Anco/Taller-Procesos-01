import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConvivenciaService } from '../../../convivencia/application/services/convivencia.service';
import { Rol } from '../../../../shared/domain/enums/rol.enum';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let convivenciaService: jest.Mocked<ConvivenciaService>;
  let jwtService: jest.Mocked<JwtService>;
  let bcryptCompareMock: jest.MockedFunction<typeof bcrypt.compare>;

  beforeEach(() => {
    convivenciaService = {
      obtenerUsuarioAutenticablePorCorreo: jest.fn(),
    } as unknown as jest.Mocked<ConvivenciaService>;

    jwtService = {
      signAsync: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    service = new AuthService(convivenciaService, jwtService);
    bcryptCompareMock = bcrypt.compare as jest.MockedFunction<
      typeof bcrypt.compare
    >;
    bcryptCompareMock.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('retorna access token y usuario autenticado cuando las credenciales son validas', async () => {
    convivenciaService.obtenerUsuarioAutenticablePorCorreo.mockResolvedValue({
      id: 'usr_1',
      nombre: 'Psicologia Escolar',
      correo: 'psicologia@colegio.edu',
      rol: Rol.PSICOLOGO,
      activo: true,
      passwordHash: 'hash_guardado',
    });
    bcryptCompareMock.mockResolvedValue(true as never);
    jwtService.signAsync.mockResolvedValue('jwt-token-valido');

    await expect(
      service.login({
        correo: 'psicologia@colegio.edu',
        password: 'ClaveSegura123',
      }),
    ).resolves.toEqual({
      accessToken: 'jwt-token-valido',
      usuario: {
        id: 'usr_1',
        nombre: 'Psicologia Escolar',
        correo: 'psicologia@colegio.edu',
        rol: Rol.PSICOLOGO,
      },
    });

    expect(jwtService.signAsync.mock.calls).toEqual([
      [
        {
          id: 'usr_1',
          nombre: 'Psicologia Escolar',
          correo: 'psicologia@colegio.edu',
          rol: Rol.PSICOLOGO,
        },
      ],
    ]);
  });

  it('lanza error cuando el usuario no existe o esta inactivo', async () => {
    convivenciaService.obtenerUsuarioAutenticablePorCorreo.mockResolvedValue(
      null,
    );

    await expect(
      service.login({
        correo: 'desconocido@colegio.edu',
        password: 'ClaveSegura123',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('lanza error cuando la contrasena no coincide', async () => {
    convivenciaService.obtenerUsuarioAutenticablePorCorreo.mockResolvedValue({
      id: 'usr_1',
      nombre: 'Docente Tutor',
      correo: 'docente@colegio.edu',
      rol: Rol.DOCENTE,
      activo: true,
      passwordHash: 'hash_guardado',
    });
    bcryptCompareMock.mockResolvedValue(false as never);

    await expect(
      service.login({
        correo: 'docente@colegio.edu',
        password: 'ClaveIncorrecta123',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
