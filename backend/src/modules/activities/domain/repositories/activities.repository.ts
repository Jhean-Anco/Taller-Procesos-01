import { PreventiveActivity } from '../entities/preventive-activity.entity';

export const ACTIVITIES_REPOSITORY = Symbol('ACTIVITIES_REPOSITORY');

export interface ActivitiesRepository {
  create(activity: PreventiveActivity): Promise<PreventiveActivity>;
  save(activity: PreventiveActivity): Promise<PreventiveActivity>;
  findById(id: string): Promise<PreventiveActivity | null>;
  list(): Promise<PreventiveActivity[]>;
  count(): Promise<number>;
}
