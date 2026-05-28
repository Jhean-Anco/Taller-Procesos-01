import { InternalUser } from '../entities/internal-user.entity';

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');

export interface UsersRepository {
  create(user: InternalUser): Promise<InternalUser>;
  findById(id: string): Promise<InternalUser | null>;
  findByEmail(email: string): Promise<InternalUser | null>;
  list(): Promise<InternalUser[]>;
  save(user: InternalUser): Promise<InternalUser>;
}
