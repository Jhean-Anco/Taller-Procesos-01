import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditModule } from '../audit/audit.module';
import { MemoryStoreModule } from '../shared/infrastructure/memory/memory-store.module';
import { ActivitiesService } from './application/use-cases/activities.service';
import { ACTIVITIES_REPOSITORY } from './domain/repositories/activities.repository';
import { PreventiveActivitiesController } from './infrastructure/http/controllers/preventive-activities.controller';
import { InMemoryActivitiesRepository } from './infrastructure/persistence/memory/in-memory-activities.repository';
import { PreventiveActivityOrmEntity } from './infrastructure/persistence/typeorm/entities/preventive-activity.orm-entity';
import { TypeOrmActivitiesRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-activities.repository';

const databaseEnabled = process.env.DATABASE_ENABLED === 'true';

@Module({
  imports: [
    MemoryStoreModule,
    AuditModule,
    ...(databaseEnabled ? [TypeOrmModule.forFeature([PreventiveActivityOrmEntity])] : []),
  ],
  controllers: [PreventiveActivitiesController],
  providers: [
    ActivitiesService,
    ...(databaseEnabled ? [TypeOrmActivitiesRepository] : [InMemoryActivitiesRepository]),
    {
      provide: ACTIVITIES_REPOSITORY,
      useExisting: databaseEnabled
        ? TypeOrmActivitiesRepository
        : InMemoryActivitiesRepository,
    },
  ],
  exports: [ActivitiesService, ACTIVITIES_REPOSITORY],
})
export class ActivitiesModule {}
