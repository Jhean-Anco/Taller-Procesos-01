import { InternalUser } from '../../../../domain/entities/internal-user.entity';
import { InternalUserOrmEntity } from '../entities/internal-user.orm-entity';

export class InternalUserMapper {
  static toDomain(entity: InternalUserOrmEntity): InternalUser {
    return new InternalUser({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      passwordHash: entity.passwordHash,
      role: entity.role,
      active: entity.active,
      tokenVersion: entity.tokenVersion ?? 0,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toOrm(user: InternalUser): InternalUserOrmEntity {
    const props = user.toPrimitives();
    const entity = new InternalUserOrmEntity();
    entity.id = props.id;
    entity.name = props.name;
    entity.email = props.email;
    entity.passwordHash = props.passwordHash;
    entity.role = props.role;
    entity.active = props.active;
    entity.tokenVersion = props.tokenVersion ?? 0;
    entity.createdAt = props.createdAt;
    entity.updatedAt = props.updatedAt;
    return entity;
  }
}
