import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalUser } from '../../../../domain/entities/internal-user.entity';
import { UsersRepository } from '../../../../domain/repositories/users.repository';
import { InternalUserOrmEntity } from '../entities/internal-user.orm-entity';
import { InternalUserMapper } from '../mappers/internal-user.mapper';

@Injectable()
export class TypeOrmUsersRepository implements UsersRepository {
  constructor(
    @InjectRepository(InternalUserOrmEntity)
    private readonly repository: Repository<InternalUserOrmEntity>,
  ) {}

  async create(user: InternalUser): Promise<InternalUser> {
    const saved = await this.repository.save(InternalUserMapper.toOrm(user));
    return InternalUserMapper.toDomain(saved);
  }

  async findById(id: string): Promise<InternalUser | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? InternalUserMapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<InternalUser | null> {
    const entity = await this.repository.findOneBy({ email: email.toLowerCase() });
    return entity ? InternalUserMapper.toDomain(entity) : null;
  }

  async list(): Promise<InternalUser[]> {
    const entities = await this.repository.find({ order: { createdAt: 'DESC' } });
    return entities.map(InternalUserMapper.toDomain);
  }

  async save(user: InternalUser): Promise<InternalUser> {
    const saved = await this.repository.save(InternalUserMapper.toOrm(user));
    return InternalUserMapper.toDomain(saved);
  }
}
