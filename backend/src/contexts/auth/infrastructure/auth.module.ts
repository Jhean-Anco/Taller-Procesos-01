import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { AuthService } from '../application/services/auth.service';
import { AuthController } from './adapters/input/http/auth.controller';
import { ConvivenciaService } from '../../../contexts/convivencia/application/services/convivencia.service';
import { JwtTokenSignerAdapter } from './adapters/output/jwt-token-signer.adapter';
import { TOKEN_SIGNER_PORT } from '../application/ports/output/token-signer.port';

@Global()
@Module({
  imports: [
    ConfigModule,
    // El módulo JWT se configura desde variables de entorno para no fijar secretos en código.
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') ?? 'jwt-secret-dev-inseguro',
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') ??
            '8h') as StringValue,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: TOKEN_SIGNER_PORT,
      useFactory: (jwtService: JwtService) => new JwtTokenSignerAdapter(jwtService),
      inject: [JwtService],
    },
    {
      provide: AuthService,
      useFactory: (
        convivenciaService: ConvivenciaService,
        tokenSigner: unknown,
      ) => new AuthService(convivenciaService, tokenSigner as never),
      inject: [ConvivenciaService, TOKEN_SIGNER_PORT],
    },
  ],
  exports: [AuthService, JwtModule],
})
export class ModuloAuth {}
