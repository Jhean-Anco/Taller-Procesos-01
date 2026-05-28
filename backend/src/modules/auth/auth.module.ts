import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { AuditModule } from '../audit/audit.module';
import { UsersModule } from '../users/users.module';
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
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') ?? '8h') as StringValue,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthUseCases,
    JwtTokenSignerAdapter,
    LegacyConvivenciaAuthFallbackAdapter,
    { provide: TOKEN_SIGNER, useExisting: JwtTokenSignerAdapter },
    {
      provide: LEGACY_AUTH_FALLBACK,
      useExisting: LegacyConvivenciaAuthFallbackAdapter,
    },
  ],
  exports: [AuthUseCases, JwtModule],
})
export class AuthModule {}
