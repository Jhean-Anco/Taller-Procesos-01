import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { PuertoVerificacionSalud } from '../../../application/ports/output/verificacion-salud.port';
import { Salud } from '../../../domain/entities/salud.entidad';

@Injectable()
export class AdaptadorSaludSistema implements PuertoVerificacionSalud {
  constructor(private readonly configService: ConfigService) {}

  verificar(): Promise<Salud> {
    const service = this.configService.get<string>('APP_NAME') ?? 'backend';

    return Promise.resolve(new Salud('ok', service));
  }
}
