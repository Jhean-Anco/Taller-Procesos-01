import { Injectable, Optional } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConvivenciaService } from '../../../../contexts/convivencia/application/services/convivencia.service';
import { UsuarioAutenticado } from '../../../../shared/infrastructure/auth/usuario-autenticado.interface';
import { LegacyAuthFallbackPort } from '../../application/ports/legacy-auth-fallback.port';

@Injectable()
export class LegacyConvivenciaAuthFallbackAdapter implements LegacyAuthFallbackPort {
  constructor(
    @Optional()
    private readonly convivenciaService?: ConvivenciaService,
  ) {}

  async validate(email: string, password: string): Promise<UsuarioAutenticado | null> {
    if (!this.convivenciaService) {
      return null;
    }
    const legacyUser =
      await this.convivenciaService.obtenerUsuarioAutenticablePorCorreo(email);
    if (!legacyUser?.activo) {
      return null;
    }
    const valid = await bcrypt.compare(password, legacyUser.passwordHash);
    if (!valid) {
      return null;
    }
    return {
      id: legacyUser.id,
      nombre: legacyUser.nombre,
      correo: legacyUser.correo,
      rol: legacyUser.rol,
    };
  }
}
