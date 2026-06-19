import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { AuditModule } from '../audit/audit.module';
import { AuditService } from '../audit/application/use-cases/audit.service';
import { UsersModule } from '../users/users.module';
import { USERS_REPOSITORY, UsersRepository } from '../users/domain/repositories/users.repository';
import { PASSWORD_HASHER, PasswordHasherPort } from '../users/application/ports/password-hasher.port';
import { ModuloIa } from '../../contexts/ia/infrastructure/ia.module';
import { ModuloConvivencia } from '../../contexts/convivencia/infrastructure/convivencia.module';
import { AuthUseCases } from './application/use-cases/auth.use-cases';
import { LEGACY_AUTH_FALLBACK } from './application/ports/legacy-auth-fallback.port';
import { TOKEN_SIGNER } from './application/ports/token-signer.port';
import { AuthController } from './infrastructure/http/controllers/auth.controller';
import { LegacyConvivenciaAuthFallbackAdapter } from './infrastructure/security/legacy-convivencia-auth-fallback.adapter';
import { JwtTokenSignerAdapter } from './infrastructure/security/jwt-token-signer.adapter';

@Global()
@Module({
  imports: [
    ConfigModule,
    UsersModule,
    AuditModule,
    ModuloIa.registrar(),
    ModuloConvivencia.registrar(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') ??
          (process.env.NODE_ENV === 'test' ? 'test-jwt-secret' : ''),
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') ?? '8h') as StringValue,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtTokenSignerAdapter,
    LegacyConvivenciaAuthFallbackAdapter,
    {
      provide: AuthUseCases,
      useFactory: (
        usersRepository: UsersRepository,
        passwordHasher: PasswordHasherPort,
        tokenSigner: JwtTokenSignerAdapter,
        legacyFallback: LegacyConvivenciaAuthFallbackAdapter,
        auditService: AuditService,
      ) =>
        new AuthUseCases(
          usersRepository,
          passwordHasher,
          tokenSigner,
          legacyFallback,
          auditService,
        ),
      inject: [
        USERS_REPOSITORY,
        PASSWORD_HASHER,
        TOKEN_SIGNER,
        LEGACY_AUTH_FALLBACK,
        AuditService,
      ],
    },
    { provide: TOKEN_SIGNER, useExisting: JwtTokenSignerAdapter },
    {
      provide: LEGACY_AUTH_FALLBACK,
      useExisting: LegacyConvivenciaAuthFallbackAdapter,
    },
  ],
  exports: [AuthUseCases, JwtModule],
})
export class AuthModule {}
