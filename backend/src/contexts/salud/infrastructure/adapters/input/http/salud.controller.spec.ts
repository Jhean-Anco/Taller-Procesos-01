import { Test, TestingModule } from '@nestjs/testing';
import { SaludService } from '../../../../application/services/salud.service';
import { SaludControlador } from './salud.controller';

describe('SaludControlador', () => {
  let controller: SaludControlador;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaludControlador],
      providers: [
        {
          provide: SaludService,
          useValue: {
            obtenerSalud: jest
              .fn()
              .mockResolvedValue({ status: 'ok', service: 'backend' }),
          },
        },
      ],
    }).compile();

    controller = module.get<SaludControlador>(SaludControlador);
  });

  it('retorna el estado actual del servicio', async () => {
    await expect(controller.obtenerSalud()).resolves.toEqual({
      status: 'ok',
      service: 'backend',
    });
  });
});
