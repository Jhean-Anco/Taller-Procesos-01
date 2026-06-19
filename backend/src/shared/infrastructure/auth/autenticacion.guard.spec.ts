import { UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Rol } from '../../domain/enums/rol.enum';
import { GuardiaAutenticacion } from './autenticacion.guard';
import { UsersRepository } from '../../../modules/users/domain/repositories/users.repository';

describe('GuardiaAutenticacion', () => {
  let guard: GuardiaAutenticacion;
  let reflector: jest.Mocked<Reflector>;
  let jwtService: jest.Mocked<JwtService>;
  let usersRepository: jest.Mocked<UsersRepository>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;
    jwtService = {
      verify: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;
    usersRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<UsersRepository>;

    guard = new GuardiaAutenticacion(reflector, jwtService, usersRepository);
  });

  const crearContexto = (request: {
    session?: { usuario?: unknown };
    header?: (nombre: string) => string | undefined;
    usuario?: unknown;
  }) =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    }) as never;

  it('permite rutas publicas', async () => {
    reflector.getAllAndOverride.mockReturnValue(true);

    await expect(guard.canActivate(crearContexto({}))).resolves.toBe(true);
  });

  it('usa la sesion activa cuando existe', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    usersRepository.findById.mockResolvedValue({
      id: 'usr_1',
      name: 'Docente Tutor',
      email: 'docente@colegio.edu',
      passwordHash: 'hash',
      role: Rol.DOCENTE as never,
      active: true,
      tokenVersion: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      update: jest.fn(),
      changeStatus: jest.fn(),
      toPrimitives: jest.fn(),
    } as never);
    const usuarioSesion = {
      id: 'usr_1',
      nombre: 'Docente Tutor',
      correo: 'docente@colegio.edu',
      rol: Rol.DOCENTE,
      tokenVersion: 0,
    };
    const request: {
      session: { usuario: typeof usuarioSesion };
      header: jest.Mock;
      usuario?: typeof usuarioSesion;
    } = {
      session: { usuario: usuarioSesion },
      header: jest.fn(),
    };

    await expect(guard.canActivate(crearContexto(request))).resolves.toBe(true);
    expect(request.usuario).toEqual(usuarioSesion);
  });

  it('valida un bearer token y asigna el usuario al request', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    usersRepository.findById.mockResolvedValue({
      id: 'usr_2',
      name: 'Psicologia Escolar',
      email: 'psicologia@colegio.edu',
      passwordHash: 'hash',
      role: Rol.PSICOLOGO as never,
      active: true,
      tokenVersion: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      update: jest.fn(),
      changeStatus: jest.fn(),
      toPrimitives: jest.fn(),
    } as never);
    jwtService.verify.mockReturnValue({
      id: 'usr_2',
      nombre: 'Psicologia Escolar',
      correo: 'psicologia@colegio.edu',
      rol: Rol.PSICOLOGO,
      tokenVersion: 2,
      jti: 'jti-1',
    });
    const request: {
      header: jest.Mock;
      usuario?: unknown;
    } = {
      header: jest.fn().mockReturnValue('Bearer jwt-token-valido'),
    };

    await expect(guard.canActivate(crearContexto(request))).resolves.toBe(true);
    expect(jwtService.verify.mock.calls).toEqual([['jwt-token-valido']]);
    expect(request.usuario).toMatchObject({
      id: 'usr_2',
      nombre: 'Psicologia Escolar',
      correo: 'psicologia@colegio.edu',
      rol: Rol.PSICOLOGO,
      tokenVersion: 2,
      jti: 'jti-1',
    });
  });

  it('rechaza la peticion cuando no hay sesion ni bearer token', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    const request = {
      header: jest.fn().mockReturnValue(undefined),
    };

    await expect(guard.canActivate(crearContexto(request))).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
