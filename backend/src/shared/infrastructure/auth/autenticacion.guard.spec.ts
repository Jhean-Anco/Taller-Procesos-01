import { Reflector } from '@nestjs/core';
import { GuardiaAutenticacion } from './autenticacion.guard';

describe('GuardiaAutenticacion', () => {
  it('falla cuando la sesion tiene tokenVersion desactualizada', async () => {
    const guard = new GuardiaAutenticacion(
      new Reflector(),
      { verify: () => ({ id: 'u1', tokenVersion: 1 }) } as any,
      {
        findById: async () => ({ active: true, tokenVersion: 2, role: 'PSYCHOLOGIST' }),
      } as any,
    );
    const request: any = { session: { usuario: { id: 'u1', tokenVersion: 1 } }, header: () => undefined, socket: {} };
    const context: any = {
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({ getRequest: () => request }),
    };
    await expect(guard.canActivate(context)).rejects.toThrow();
  });
});
