import { Injectable } from '@nestjs/common';
import { InstitutionalMemoryStore } from '../../../../shared/infrastructure/memory/institutional-memory-store';
import { InternalUser } from '../../../domain/entities/internal-user.entity';
import { UsersRepository } from '../../../domain/repositories/users.repository';

@Injectable()
export class InMemoryUsersRepository implements UsersRepository {
  constructor(private readonly store: InstitutionalMemoryStore) {}

  create(user: InternalUser): Promise<InternalUser> {
    this.store.users.push(user);
    return Promise.resolve(user);
  }

  findById(id: string): Promise<InternalUser | null> {
    return Promise.resolve(this.store.users.find((user) => user.id === id) ?? null);
  }

  findByEmail(email: string): Promise<InternalUser | null> {
    return Promise.resolve(
      this.store.users.find((user) => user.email === email.toLowerCase()) ?? null,
    );
  }

  list(): Promise<InternalUser[]> {
    return Promise.resolve([...this.store.users]);
  }

  save(user: InternalUser): Promise<InternalUser> {
    const index = this.store.users.findIndex((item) => item.id === user.id);
    if (index >= 0) {
      this.store.users[index] = user;
    } else {
      this.store.users.push(user);
    }
    return Promise.resolve(user);
  }
}
