import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertsModule } from '../alerts/alerts.module';
import { AuditModule } from '../audit/audit.module';
import { MemoryStoreModule } from '../shared/infrastructure/memory/memory-store.module';
import { ReportsUseCases } from './application/use-cases/reports.use-cases';
import { AI_ANALYZER } from './application/ports/ai-analyzer.port';
import { REPORTS_REPOSITORY } from './domain/repositories/reports.repository';
import { PythonAiClientAdapter } from './infrastructure/ai/python-ai-client.adapter';
import { AnonymousReportsController } from './infrastructure/http/controllers/anonymous-reports.controller';
import { PsychologistReportsController } from './infrastructure/http/controllers/psychologist-reports.controller';
import { PublicReportRateLimitGuard } from './infrastructure/http/guards/public-report-rate-limit.guard';
import { InMemoryReportsRepository } from './infrastructure/persistence/memory/in-memory-reports.repository';
import { AiAnalysisOrmEntity } from './infrastructure/persistence/typeorm/entities/ai-analysis.orm-entity';
import { AnonymousReportOrmEntity } from './infrastructure/persistence/typeorm/entities/anonymous-report.orm-entity';
import { DerivationOrmEntity } from './infrastructure/persistence/typeorm/entities/derivation.orm-entity';
import { PsychologicalReviewOrmEntity } from './infrastructure/persistence/typeorm/entities/psychological-review.orm-entity';
import { TypeOrmReportsRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-reports.repository';

const databaseEnabled = process.env.DATABASE_ENABLED === 'true';

@Module({
  imports: [
    MemoryStoreModule,
    AlertsModule,
    AuditModule,
    ...(databaseEnabled
      ? [
          TypeOrmModule.forFeature([
            AnonymousReportOrmEntity,
            AiAnalysisOrmEntity,
            PsychologicalReviewOrmEntity,
            DerivationOrmEntity,
          ]),
        ]
      : []),
  ],
  controllers: [AnonymousReportsController, PsychologistReportsController],
  providers: [
    ReportsUseCases,
    PythonAiClientAdapter,
    PublicReportRateLimitGuard,
    ...(databaseEnabled ? [TypeOrmReportsRepository] : [InMemoryReportsRepository]),
    {
      provide: REPORTS_REPOSITORY,
      useExisting: databaseEnabled
        ? TypeOrmReportsRepository
        : InMemoryReportsRepository,
    },
    {
      provide: AI_ANALYZER,
      useExisting: PythonAiClientAdapter,
    },
  ],
  exports: [ReportsUseCases, REPORTS_REPOSITORY],
})
export class ReportsModule {}
