import { Injectable } from '@nestjs/common';
import { InstitutionalMemoryStore } from '../../../../shared/infrastructure/memory/institutional-memory-store';
import { PreventiveActivity } from '../../../domain/entities/preventive-activity.entity';
import { ActivitiesRepository } from '../../../domain/repositories/activities.repository';

@Injectable()
export class InMemoryActivitiesRepository implements ActivitiesRepository {
  constructor(private readonly store: InstitutionalMemoryStore) {}

  create(activity: PreventiveActivity): Promise<PreventiveActivity> {
    this.store.activities.push(activity);
    return Promise.resolve(activity);
  }

  save(activity: PreventiveActivity): Promise<PreventiveActivity> {
    const index = this.store.activities.findIndex((item) => item.id === activity.id);
    if (index >= 0) this.store.activities[index] = activity;
    return Promise.resolve(activity);
  }

  findById(id: string): Promise<PreventiveActivity | null> {
    return Promise.resolve(this.store.activities.find((item) => item.id === id) ?? null);
  }

  list(): Promise<PreventiveActivity[]> {
    return Promise.resolve([...this.store.activities]);
  }

  count(): Promise<number> {
    return Promise.resolve(this.store.activities.length);
  }
}
