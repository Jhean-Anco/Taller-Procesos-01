import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Rol } from '../../domain/enums/rol.enum';
import { GuardiaRoles } from './guardia-roles.guard';

describe('GuardiaRoles', () => {
  let guard: GuardiaRoles;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;
    guard = new GuardiaRoles(reflector);
  });

  const crearContexto = (request: { usuario?: { rol: Rol } }) =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    }) as never;

  it('permite el acceso cuando la ruta no define roles', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);

    expect(guard.canActivate(crearContexto({}))).toBe(true);
  });

  it('permite el acceso cuando el usuario tiene un rol admitido', () => {
    reflector.getAllAndOverride.mockReturnValue([Rol.ADMIN, Rol.PSICOLOGO]);

    expect(
      guard.canActivate(
        crearContexto({
          usuario: { rol: Rol.PSICOLOGO },
        }),
      ),
    ).toBe(true);
  });

  it('rechaza el acceso cuando el usuario no tiene permisos', () => {
    reflector.getAllAndOverride.mockReturnValue([Rol.ADMIN]);

    expect(() =>
      guard.canActivate(
        crearContexto({
          usuario: { rol: Rol.DOCENTE },
        }),
      ),
    ).toThrow(ForbiddenException);
  });
});
