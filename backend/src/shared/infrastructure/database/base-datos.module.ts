import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [],
})
export class ModuloBaseDatos {
  static registrar(): DynamicModule {
    const habilitado = process.env.DATABASE_ENABLED === 'true';

    return {
      module: ModuloBaseDatos,
      imports: habilitado
        ? [
            TypeOrmModule.forRootAsync({
              imports: [ConfigModule],
              inject: [ConfigService],
              useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DATABASE_HOST'),
                port: Number(configService.get<string>('DATABASE_PORT')),
                username: configService.get<string>('DATABASE_USERNAME'),
                password: configService.get<string>('DATABASE_PASSWORD'),
                database: configService.get<string>('DATABASE_NAME'),
                autoLoadEntities: true,
                synchronize:
                  configService.get<string>('DATABASE_SYNC') === 'true',
                ssl:
                  configService.get<string>('DATABASE_SSL') === 'true'
                    ? { rejectUnauthorized: false }
                    : false,
              }),
            }),
          ]
        : [],
    };
  }
}
