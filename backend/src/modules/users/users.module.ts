import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemoryStoreModule } from '../shared/infrastructure/memory/memory-store.module';
import { UsersUseCases } from './application/use-cases/users.use-cases';
import { PASSWORD_HASHER } from './application/ports/password-hasher.port';
import { USERS_REPOSITORY } from './domain/repositories/users.repository';
import { UsersController } from './infrastructure/http/controllers/users.controller';
import { InMemoryUsersRepository } from './infrastructure/persistence/memory/in-memory-users.repository';
import { InternalUserOrmEntity } from './infrastructure/persistence/typeorm/entities/internal-user.orm-entity';
import { TypeOrmUsersRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-users.repository';
import { BcryptPasswordHasherAdapter } from './infrastructure/security/bcrypt-password-hasher.adapter';

const databaseEnabled = process.env.DATABASE_ENABLED === 'true';

@Module({
  imports: [
    MemoryStoreModule,
    ...(databaseEnabled ? [TypeOrmModule.forFeature([InternalUserOrmEntity])] : []),
  ],
  controllers: [UsersController],
  providers: [
    UsersUseCases,
    BcryptPasswordHasherAdapter,
    ...(databaseEnabled ? [TypeOrmUsersRepository] : [InMemoryUsersRepository]),
    {
      provide: PASSWORD_HASHER,
      useExisting: BcryptPasswordHasherAdapter,
    },
    {
      provide: USERS_REPOSITORY,
      useExisting: databaseEnabled ? TypeOrmUsersRepository : InMemoryUsersRepository,
    },
  ],
  exports: [USERS_REPOSITORY, PASSWORD_HASHER, UsersUseCases],
})
export class UsersModule {}
