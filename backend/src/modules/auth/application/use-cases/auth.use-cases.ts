import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuditService } from '../../../audit/application/use-cases/audit.service';
import { Rol } from '../../../../shared/domain/enums/rol.enum';
import { UsuarioAutenticado } from '../../../../shared/infrastructure/auth/usuario-autenticado.interface';
import { USERS_REPOSITORY, UsersRepository } from '../../../users/domain/repositories/users.repository';
import { PASSWORD_HASHER, PasswordHasherPort } from '../../../users/application/ports/password-hasher.port';
import { LoginDto } from '../dtos/auth.dtos';
import { LEGACY_AUTH_FALLBACK, LegacyAuthFallbackPort } from '../ports/legacy-auth-fallback.port';
import { TOKEN_SIGNER, TokenSignerPort } from '../ports/token-signer.port';

@Injectable()
export class AuthUseCases {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(TOKEN_SIGNER)
    private readonly tokenSigner: TokenSignerPort,
    @Inject(LEGACY_AUTH_FALLBACK)
    private readonly legacyFallback: LegacyAuthFallbackPort,
    private readonly auditService: AuditService,
  ) {}

  async login(dto: LoginDto, ip?: string) {
    const email = (dto.email ?? dto.correo ?? '').toLowerCase();
    const password = dto.password ?? dto.claveAcceso ?? '';

    if (!email || !password) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const user = await this.usersRepository.findByEmail(email);
    let authenticated: UsuarioAutenticado | null = null;

    if (user?.active && (await this.passwordHasher.compare(password, user.passwordHash))) {
      authenticated = {
        id: user.id,
        nombre: user.name,
        correo: user.email,
        rol: user.role as unknown as Rol,
      };
    }

    if (!authenticated) {
      authenticated = await this.legacyFallback.validate(email, password);
    }

    if (!authenticated) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const accessToken = await this.tokenSigner.sign(authenticated);
    await this.auditService.register({
      actorUserId: authenticated.id,
      action: 'LOGIN',
      entityType: 'user',
      entityId: authenticated.id,
      ip,
    });

    return {
      accessToken,
      usuario: authenticated,
      user: {
        id: authenticated.id,
        name: authenticated.nombre,
        email: authenticated.correo,
        role: authenticated.rol,
      },
    };
  }

  current(user: UsuarioAutenticado) {
    return {
      usuario: user,
      user: {
        id: user.id,
        name: user.nombre,
        email: user.correo,
        role: user.rol,
      },
    };
  }
}
