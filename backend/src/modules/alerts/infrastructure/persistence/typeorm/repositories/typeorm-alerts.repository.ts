import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Alert } from '../../../../domain/entities/alert.entity';
import {
  AlertFilters,
  AlertsRepository,
} from '../../../../domain/repositories/alerts.repository';
import { AlertStatus } from '../../../../../shared/domain/enums';
import { AlertOrmEntity } from '../entities/alert.orm-entity';
import { AlertMapper } from '../mappers/alert.mapper';

@Injectable()
export class TypeOrmAlertsRepository implements AlertsRepository {
  constructor(
    @InjectRepository(AlertOrmEntity)
    private readonly repository: Repository<AlertOrmEntity>,
  ) {}

  async create(alert: Alert): Promise<Alert> {
    const saved = await this.repository.save(AlertMapper.toOrm(alert));
    return AlertMapper.toDomain(saved);
  }

  async save(alert: Alert): Promise<Alert> {
    const saved = await this.repository.save(AlertMapper.toOrm(alert));
    return AlertMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Alert | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? AlertMapper.toDomain(entity) : null;
  }

  async findActiveByReportId(reportId: string): Promise<Alert | null> {
    const entity = await this.repository.findOne({
      where: { reportId, status: Not(AlertStatus.CLOSED) },
      order: { createdAt: 'DESC' },
    });
    return entity ? AlertMapper.toDomain(entity) : null;
  }

  async list(filters?: AlertFilters): Promise<Alert[]> {
    const entities = await this.repository.find({
      where: {
        ...(filters?.status ? { status: filters.status } : {}),
        ...(filters?.riskLevel ? { riskLevel: filters.riskLevel } : {}),
      },
      order: { riskLevel: 'DESC', createdAt: 'DESC' },
    });
    return entities.map(AlertMapper.toDomain);
  }

  async countByStatus(): Promise<Record<string, number>> {
    const rows = await this.repository
      .createQueryBuilder('alert')
      .select('alert.status', 'status')
      .addSelect('COUNT(*)', 'total')
      .groupBy('alert.status')
      .getRawMany<{ status: string; total: string }>();

    return Object.fromEntries(rows.map((row) => [row.status, Number(row.total)]));
  }
}
