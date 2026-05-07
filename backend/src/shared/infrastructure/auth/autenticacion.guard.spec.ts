import { UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Rol } from '../../domain/enums/rol.enum';
import { GuardiaAutenticacion } from './autenticacion.guard';

describe('GuardiaAutenticacion', () => {
  let guard: GuardiaAutenticacion;
  let reflector: jest.Mocked<Reflector>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;
    jwtService = {
      verify: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    guard = new GuardiaAutenticacion(reflector, jwtService);
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

  it('permite rutas publicas', () => {
    reflector.getAllAndOverride.mockReturnValue(true);

    expect(guard.canActivate(crearContexto({}))).toBe(true);
  });

  it('usa la sesion activa cuando existe', () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    const usuarioSesion = {
      id: 'usr_1',
      nombre: 'Docente Tutor',
      correo: 'docente@colegio.edu',
      rol: Rol.DOCENTE,
    };
    const request = {
      session: { usuario: usuarioSesion },
      header: jest.fn(),
    };

    expect(guard.canActivate(crearContexto(request))).toBe(true);
    expect(request.usuario).toEqual(usuarioSesion);
  });

  it('valida un bearer token y asigna el usuario al request', () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    const usuarioToken = {
      id: 'usr_2',
      nombre: 'Psicologia Escolar',
      correo: 'psicologia@colegio.edu',
      rol: Rol.PSICOLOGO,
    };
    jwtService.verify.mockReturnValue(usuarioToken);
    const request = {
      header: jest.fn().mockReturnValue('Bearer jwt-token-valido'),
    };

    expect(guard.canActivate(crearContexto(request))).toBe(true);
    expect(jwtService.verify.mock.calls).toEqual([['jwt-token-valido']]);
    expect(request.usuario).toEqual(usuarioToken);
  });

  it('rechaza la peticion cuando no hay sesion ni bearer token', () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    const request = {
      header: jest.fn().mockReturnValue(undefined),
    };

    expect(() => guard.canActivate(crearContexto(request))).toThrow(
      UnauthorizedException,
    );
  });
});
