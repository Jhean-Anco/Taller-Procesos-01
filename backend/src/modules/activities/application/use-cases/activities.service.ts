import { AuditService } from '../../../audit/application/use-cases/audit.service';
import { PreventiveActivityStatus } from '../../../shared/domain/enums';
import { generarIdSeguro } from '../../../shared/domain/id-generator';
import { PreventiveActivity } from '../../domain/entities/preventive-activity.entity';
import {
  ACTIVITIES_REPOSITORY,
  ActivitiesRepository,
} from '../../domain/repositories/activities.repository';
import {
  CreatePreventiveActivityDto,
  UpdatePreventiveActivityDto,
} from '../dtos/activity.dtos';
import { ActivityNotFoundError } from '../errors/activities.errors';

export class ActivitiesService {
  constructor(
    private readonly activitiesRepository: ActivitiesRepository,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreatePreventiveActivityDto, actorId: string, ip?: string) {
    const now = new Date();
    const activity = await this.activitiesRepository.create(
      new PreventiveActivity({
        id: generarIdSeguro('act'),
        reportId: dto.report_id ?? null,
        title: dto.title,
        description: dto.description,
        objective: dto.objective,
        activityType: dto.activity_type,
        responsible: dto.responsible,
        scheduledDate: new Date(dto.scheduled_date),
        status: PreventiveActivityStatus.PLANNED,
        createdBy: actorId,
        createdAt: now,
        updatedAt: now,
      }),
    );
    await this.auditService.register({
      actorUserId: actorId,
      action: 'CREATE_PREVENTIVE_ACTIVITY',
      entityType: 'preventive_activity',
      entityId: activity.id,
      ip,
    });
    return this.present(activity);
  }

  async list() {
    return (await this.activitiesRepository.list()).map((activity) =>
      this.present(activity),
    );
  }

  async update(id: string, dto: UpdatePreventiveActivityDto, actorId: string, ip?: string) {
    const activity = await this.get(id);
    const updates: Parameters<PreventiveActivity['update']>[0] = {};
    if (dto.title !== undefined) updates.title = dto.title;
    if (dto.report_id !== undefined) updates.reportId = dto.report_id;
    if (dto.description !== undefined) updates.description = dto.description;
    if (dto.objective !== undefined) updates.objective = dto.objective;
    if (dto.activity_type !== undefined) updates.activityType = dto.activity_type;
    if (dto.responsible !== undefined) updates.responsible = dto.responsible;
    if (dto.scheduled_date !== undefined) {
      updates.scheduledDate = new Date(dto.scheduled_date);
    }
    if (dto.status !== undefined) updates.status = dto.status;
    const saved = await this.activitiesRepository.save(
      activity.update(updates),
    );
    await this.auditService.register({
      actorUserId: actorId,
      action: 'UPDATE_PREVENTIVE_ACTIVITY',
      entityType: 'preventive_activity',
      entityId: id,
      ip,
    });
    return this.present(saved);
  }

  async changeStatus(id: string, status: PreventiveActivityStatus, actorId: string, ip?: string) {
    const activity = await this.get(id);
    const saved = await this.activitiesRepository.save(activity.changeStatus(status));
    await this.auditService.register({
      actorUserId: actorId,
      action: 'CHANGE_PREVENTIVE_ACTIVITY_STATUS',
      entityType: 'preventive_activity',
      entityId: id,
      metadata: { status },
      ip,
    });
    return this.present(saved);
  }

  count(): Promise<number> {
    return this.activitiesRepository.count();
  }

  private async get(id: string): Promise<PreventiveActivity> {
    const activity = await this.activitiesRepository.findById(id);
    if (!activity) {
      throw new ActivityNotFoundError();
    }
    return activity;
  }

  private present(activity: PreventiveActivity) {
    return {
      id: activity.id,
      report_id: activity.reportId ?? null,
      title: activity.title,
      description: activity.description,
      objective: activity.objective,
      activity_type: activity.activityType,
      responsible: activity.responsible,
      scheduled_date: activity.scheduledDate.toISOString(),
      status: activity.status,
      created_by: activity.createdBy,
      created_at: activity.createdAt.toISOString(),
      updated_at: activity.updatedAt.toISOString(),
    };
  }
}
