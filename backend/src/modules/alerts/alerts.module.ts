import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemoryStoreModule } from '../shared/infrastructure/memory/memory-store.module';
import { AlertsService } from './application/use-cases/alerts.service';
import { ALERTS_REPOSITORY } from './domain/repositories/alerts.repository';
import { AlertsController } from './infrastructure/http/controllers/alerts.controller';
import { InMemoryAlertsRepository } from './infrastructure/persistence/memory/in-memory-alerts.repository';
import { AlertOrmEntity } from './infrastructure/persistence/typeorm/entities/alert.orm-entity';
import { TypeOrmAlertsRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-alerts.repository';

const databaseEnabled = process.env.DATABASE_ENABLED === 'true';

@Module({
  imports: [
    MemoryStoreModule,
    ...(databaseEnabled ? [TypeOrmModule.forFeature([AlertOrmEntity])] : []),
  ],
  controllers: [AlertsController],
  providers: [
    ...(databaseEnabled ? [TypeOrmAlertsRepository] : [InMemoryAlertsRepository]),
    {
      provide: ALERTS_REPOSITORY,
      useExisting: databaseEnabled
        ? TypeOrmAlertsRepository
        : InMemoryAlertsRepository,
    },
    {
      provide: AlertsService,
      useFactory: (alertsRepository: unknown) => new AlertsService(alertsRepository as never),
      inject: [ALERTS_REPOSITORY],
    },
  ],
  exports: [AlertsService, ALERTS_REPOSITORY],
})
export class AlertsModule {}
