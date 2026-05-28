import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { generarIdSeguro } from '../../../shared/domain/id-generator';
import { InternalUser } from '../../domain/entities/internal-user.entity';
import { USERS_REPOSITORY, UsersRepository } from '../../domain/repositories/users.repository';
import { PASSWORD_HASHER, PasswordHasherPort } from '../ports/password-hasher.port';
import {
  CreateInternalUserDto,
  InternalUserResponseDto,
  UpdateInternalUserDto,
} from '../dtos/user.dtos';

@Injectable()
export class UsersUseCases {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async create(dto: CreateInternalUserDto): Promise<InternalUserResponseDto> {
    const email = dto.email.toLowerCase();
    const existing = await this.usersRepository.findByEmail(email);
    if (existing) {
      throw new ConflictException('El correo ya esta registrado');
    }

    const now = new Date();
    const user = new InternalUser({
      id: generarIdSeguro('usr'),
      name: dto.name,
      email,
      passwordHash: await this.passwordHasher.hash(dto.password),
      role: dto.role,
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    return this.present(await this.usersRepository.create(user));
  }

  async list(): Promise<InternalUserResponseDto[]> {
    const users = await this.usersRepository.list();
    return users.map((user) => this.present(user));
  }

  async update(id: string, dto: UpdateInternalUserDto): Promise<InternalUserResponseDto> {
    const current = await this.usersRepository.findById(id);
    if (!current) {
      throw new NotFoundException('Usuario interno no encontrado');
    }

    if (dto.email) {
      const sameEmail = await this.usersRepository.findByEmail(dto.email);
      if (sameEmail && sameEmail.id !== id) {
        throw new ConflictException('El correo ya esta registrado');
      }
    }

    return this.present(await this.usersRepository.save(current.update(dto)));
  }

  async changeStatus(id: string, active: boolean): Promise<InternalUserResponseDto> {
    const current = await this.usersRepository.findById(id);
    if (!current) {
      throw new NotFoundException('Usuario interno no encontrado');
    }

    return this.present(await this.usersRepository.save(current.changeStatus(active)));
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
