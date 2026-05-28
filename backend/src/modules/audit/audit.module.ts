import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemoryStoreModule } from '../shared/infrastructure/memory/memory-store.module';
import { AuditService } from './application/use-cases/audit.service';
import { AUDIT_REPOSITORY } from './domain/repositories/audit.repository';
import { AuditController } from './infrastructure/http/controllers/audit.controller';
import { InMemoryAuditRepository } from './infrastructure/persistence/memory/in-memory-audit.repository';
import { AuditLogOrmEntity } from './infrastructure/persistence/typeorm/entities/audit-log.orm-entity';
import { TypeOrmAuditRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-audit.repository';

const databaseEnabled = process.env.DATABASE_ENABLED === 'true';

@Module({
  imports: [
    MemoryStoreModule,
    ...(databaseEnabled ? [TypeOrmModule.forFeature([AuditLogOrmEntity])] : []),
  ],
  controllers: [AuditController],
  providers: [
    AuditService,
    ...(databaseEnabled ? [TypeOrmAuditRepository] : [InMemoryAuditRepository]),
    {
      provide: AUDIT_REPOSITORY,
      useExisting: databaseEnabled ? TypeOrmAuditRepository : InMemoryAuditRepository,
    },
  ],
  exports: [AuditService, AUDIT_REPOSITORY],
})
export class AuditModule {}
