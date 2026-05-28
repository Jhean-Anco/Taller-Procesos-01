import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreventiveActivity } from '../../../../domain/entities/preventive-activity.entity';
import { ActivitiesRepository } from '../../../../domain/repositories/activities.repository';
import { PreventiveActivityOrmEntity } from '../entities/preventive-activity.orm-entity';

@Injectable()
export class TypeOrmActivitiesRepository implements ActivitiesRepository {
  constructor(
    @InjectRepository(PreventiveActivityOrmEntity)
    private readonly repository: Repository<PreventiveActivityOrmEntity>,
  ) {}

  async create(activity: PreventiveActivity): Promise<PreventiveActivity> {
    return this.toDomain(await this.repository.save(this.toOrm(activity)));
  }

  async save(activity: PreventiveActivity): Promise<PreventiveActivity> {
    return this.toDomain(await this.repository.save(this.toOrm(activity)));
  }

  async findById(id: string): Promise<PreventiveActivity | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  async list(): Promise<PreventiveActivity[]> {
    return (await this.repository.find({ order: { scheduledDate: 'DESC' } })).map((entity) =>
      this.toDomain(entity),
    );
  }

  count(): Promise<number> {
    return this.repository.count();
  }

  private toOrm(activity: PreventiveActivity): PreventiveActivityOrmEntity {
    return { ...activity.toPrimitives() } as PreventiveActivityOrmEntity;
  }

  private toDomain(entity: PreventiveActivityOrmEntity): PreventiveActivity {
    return new PreventiveActivity({ ...entity });
  }
}
