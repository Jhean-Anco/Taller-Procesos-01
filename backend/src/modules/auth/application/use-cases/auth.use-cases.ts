import { AuditService } from '../../../audit/application/use-cases/audit.service';
import { Rol } from '../../../../shared/domain/enums/rol.enum';
import { UsuarioAutenticado } from '../../../../shared/infrastructure/auth/usuario-autenticado.interface';
import { USERS_REPOSITORY, UsersRepository } from '../../../users/domain/repositories/users.repository';
import { PASSWORD_HASHER, PasswordHasherPort } from '../../../users/application/ports/password-hasher.port';
import { LoginDto } from '../dtos/auth.dtos';
import { LEGACY_AUTH_FALLBACK, LegacyAuthFallbackPort } from '../ports/legacy-auth-fallback.port';
import { TOKEN_SIGNER, TokenSignerPort } from '../ports/token-signer.port';
import { InvalidCredentialsError, LoginRateLimitExceededError } from '../errors/auth.errors';

export class AuthUseCases {
  private readonly failedAttempts = new Map<string, { count: number; blockedUntil: number }>();

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly tokenSigner: TokenSignerPort,
    private readonly legacyFallback: LegacyAuthFallbackPort,
    private readonly auditService: AuditService,
  ) {}

  async login(dto: LoginDto, ip?: string) {
    const email = (dto.email ?? dto.correo ?? '').toLowerCase();
    const password = dto.password ?? dto.claveAcceso ?? '';
    this.applyBackoff(email, ip);

    if (!email || !password) {
      throw new InvalidCredentialsError();
    }

    const user = await this.usersRepository.findByEmail(email);
    let authenticated: UsuarioAutenticado | null = null;

    if (user?.active && (await this.passwordHasher.compare(password, user.passwordHash))) {
      authenticated = {
        id: user.id,
        nombre: user.name,
        correo: user.email,
        rol: user.role as unknown as Rol,
        tokenVersion: user.tokenVersion,
      };
    }

    if (!authenticated) {
      authenticated = await this.legacyFallback.validate(email, password);
    }

    if (!authenticated) {
      this.registerFailure(email, ip);
      throw new InvalidCredentialsError();
    }

    const accessToken = await this.tokenSigner.sign(authenticated);
    this.failedAttempts.delete(`${email}:${ip ?? 'unknown'}`);
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

  private applyBackoff(email: string, ip?: string) {
    const key = `${email}:${ip ?? 'unknown'}`;
    const entry = this.failedAttempts.get(key);
    if (entry && entry.blockedUntil > Date.now()) {
      throw new LoginRateLimitExceededError();
    }
  }

  private registerFailure(email: string, ip?: string) {
    const key = `${email}:${ip ?? 'unknown'}`;
    const now = Date.now();
    const current = this.failedAttempts.get(key) ?? { count: 0, blockedUntil: 0 };
    const nextCount = current.count + 1;
    const blockedFor = Math.min(30000 * Math.pow(2, Math.max(nextCount - 3, 0)), 15 * 60 * 1000);
    this.failedAttempts.set(key, {
      count: nextCount,
      blockedUntil: now + blockedFor,
    });
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
