import { Alert } from '../../../../domain/entities/alert.entity';
import { AlertOrmEntity } from '../entities/alert.orm-entity';

export class AlertMapper {
  static toDomain(entity: AlertOrmEntity): Alert {
    return new Alert({
      id: entity.id,
      reportId: entity.reportId,
      riskLevel: entity.riskLevel,
      status: entity.status,
      generatedBy: entity.generatedBy,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toOrm(alert: Alert): AlertOrmEntity {
    const props = alert.toPrimitives();
    const entity = new AlertOrmEntity();
    entity.id = props.id;
    entity.reportId = props.reportId;
    entity.riskLevel = props.riskLevel;
    entity.status = props.status;
    entity.generatedBy = props.generatedBy;
    entity.createdAt = props.createdAt;
    entity.updatedAt = props.updatedAt;
    return entity;
  }
}
