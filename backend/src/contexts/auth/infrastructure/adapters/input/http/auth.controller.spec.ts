import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../../application/services/auth.service';
import { AuthController } from './auth.controller';
import { Rol } from '../../../../../../shared/domain/enums/rol.enum';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('guarda el usuario en la sesion durante login', async () => {
    authService.login.mockResolvedValue({
      accessToken: 'jwt-token',
      usuario: {
        id: 'usr_1',
        nombre: 'Psicologia Escolar',
        correo: 'psicologia@colegio.edu',
        rol: Rol.PSICOLOGO,
      },
    });

    const request = {
      session: {},
    };

    await expect(
      controller.login(
        {
          correo: 'psicologia@colegio.edu',
          password: 'ClaveSegura123',
        },
        request as never,
      ),
    ).resolves.toEqual({
      accessToken: 'jwt-token',
      usuario: {
        id: 'usr_1',
        nombre: 'Psicologia Escolar',
        correo: 'psicologia@colegio.edu',
        rol: Rol.PSICOLOGO,
      },
    });

    expect(request.session).toMatchObject({
      usuario: {
        id: 'usr_1',
        nombre: 'Psicologia Escolar',
        correo: 'psicologia@colegio.edu',
        rol: Rol.PSICOLOGO,
      },
    });
  });

  it('retorna el usuario autenticado desde la sesion actual', () => {
    expect(
      controller.obtenerSesion({
        usuario: {
          id: 'usr_2',
          nombre: 'Docente Tutor',
          correo: 'docente@colegio.edu',
          rol: Rol.DOCENTE,
        },
      } as never),
    ).toEqual({
      usuario: {
        id: 'usr_2',
        nombre: 'Docente Tutor',
        correo: 'docente@colegio.edu',
        rol: Rol.DOCENTE,
      },
    });
  });

  it('destruye la sesion y limpia la cookie al cerrar sesion', async () => {
    const destroy = jest.fn((callback: () => void) => callback());
    const clearCookie = jest.fn();

    await expect(
      controller.logout(
        {
          session: {
            destroy,
          },
        } as never,
        {
          clearCookie,
        } as never,
      ),
    ).resolves.toEqual({ ok: true });

    expect(destroy).toHaveBeenCalledTimes(1);
    expect(clearCookie).toHaveBeenCalledWith('connect.sid');
  });
});
