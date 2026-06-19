import { generarIdSeguro } from '../../../shared/domain/id-generator';
import { InternalUser } from '../../domain/entities/internal-user.entity';
import {
  USERS_REPOSITORY,
  UsersRepository,
} from '../../domain/repositories/users.repository';
import {
  PASSWORD_HASHER,
  PasswordHasherPort,
} from '../ports/password-hasher.port';
import {
  CreateInternalUserDto,
  InternalUserResponseDto,
  UpdateInternalUserDto,
} from '../dtos/user.dtos';
import { UserConflictError, UserNotFoundError } from '../errors/users.errors';

export class UsersUseCases {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async create(dto: CreateInternalUserDto): Promise<InternalUserResponseDto> {
    const email = dto.email.toLowerCase();
    const existing = await this.usersRepository.findByEmail(email);
    if (existing) {
      throw new UserConflictError();
    }

    const now = new Date();
    const user = new InternalUser({
      id: generarIdSeguro('usr'),
      name: dto.name,
      email,
      passwordHash: await this.passwordHasher.hash(dto.password),
      role: dto.role,
      active: true,
      tokenVersion: 1,
      createdAt: now,
      updatedAt: now,
    });

    return this.present(await this.usersRepository.create(user));
  }

  async list(): Promise<InternalUserResponseDto[]> {
    const users = await this.usersRepository.list();
    return users.map((user) => this.present(user));
  }

  async update(
    id: string,
    dto: UpdateInternalUserDto,
  ): Promise<InternalUserResponseDto> {
    const current = await this.usersRepository.findById(id);
    if (!current) {
      throw new UserNotFoundError();
    }

    if (dto.email) {
      const sameEmail = await this.usersRepository.findByEmail(dto.email);
      if (sameEmail && sameEmail.id !== id) {
        throw new UserConflictError();
      }
    }
    const updated = current.update(dto);
    return this.present(await this.usersRepository.save(updated));
  }

  async changeStatus(
    id: string,
    active: boolean,
  ): Promise<InternalUserResponseDto> {
    const current = await this.usersRepository.findById(id);
    if (!current) {
      throw new UserNotFoundError();
    }

    const updated = current.changeStatus(active);
    return this.present(await this.usersRepository.save(updated));
  }

  private present(user: InternalUser): InternalUserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
      created_at: user.createdAt.toISOString(),
      updated_at: user.updatedAt.toISOString(),
    };
  }
}
