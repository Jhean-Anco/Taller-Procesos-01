import { Test, TestingModule } from '@nestjs/testing';
import { IaService } from '../../../../application/services/ia.service';
import { IaControlador } from './ia.controller';
import { Rol } from '../../../../../../shared/domain/enums/rol.enum';

describe('IaControlador', () => {
  let controller: IaControlador;
  let iaService: jest.Mocked<IaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IaControlador],
      providers: [
        {
          provide: IaService,
          useValue: {
            generarTexto: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<IaControlador>(IaControlador);
    iaService = module.get(IaService);
  });

  it('envia prompt y rolSolicitante al servicio de IA', async () => {
    iaService.generarTexto.mockResolvedValue({
      contenido: 'Texto generado',
      modelo: 'gpt-4.1-mini',
    });

    await expect(
      controller.generarTexto(
        {
          prompt: 'Genera una guia breve para docentes.',
        },
        {
          usuario: {
            id: 'usr_1',
            nombre: 'Docente Tutor',
            correo: 'docente@colegio.edu',
            rol: Rol.DOCENTE,
          },
        } as never,
      ),
    ).resolves.toEqual({
      contenido: 'Texto generado',
      modelo: 'gpt-4.1-mini',
    });

    expect(iaService.generarTexto.mock.calls).toEqual([
      [
        {
          prompt: 'Genera una guia breve para docentes.',
          rolSolicitante: Rol.DOCENTE,
        },
      ],
    ]);
  });
});
