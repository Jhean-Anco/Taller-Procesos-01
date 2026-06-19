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
    guard = new GuardiaRoles(reflector, {
      findById: async () => ({ active: true, role: Rol.PSICOLOGO }),
    } as any);
  });

  const crearContexto = (request: { usuario?: { id?: string; rol: Rol } }) =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    }) as never;

  it('permite el acceso cuando la ruta no define roles', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);

    expect(guard.canActivate(crearContexto({}))).resolves.toBe(true);
  });

  it('permite el acceso cuando el usuario tiene un rol admitido', async () => {
    reflector.getAllAndOverride.mockReturnValue([Rol.ADMIN, Rol.PSICOLOGO]);

    await expect(
      guard.canActivate(
        crearContexto({
          usuario: { id: 'u1', rol: Rol.PSICOLOGO },
        }),
      ),
    ).resolves.toBe(true);
  });

  it('rechaza el acceso cuando el usuario no tiene permisos', async () => {
    reflector.getAllAndOverride.mockReturnValue([Rol.ADMIN]);

    await expect(
      guard.canActivate(
        crearContexto({
          usuario: { id: 'u1', rol: Rol.DOCENTE },
        }),
      ),
    ).rejects.toThrow(ForbiddenException);
  });
});
