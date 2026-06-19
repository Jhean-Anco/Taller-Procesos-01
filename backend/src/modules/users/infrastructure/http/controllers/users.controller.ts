import { Body, ConflictException, Controller, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { Rol } from '../../../../../shared/domain/enums/rol.enum';
import { ProtegerRuta } from '../../../../../shared/infrastructure/auth/proteger-ruta.decorator';
import { UsersUseCases } from '../../../application/use-cases/users.use-cases';
import { UserConflictError, UserNotFoundError } from '../../../application/errors/users.errors';
import {
  CreateInternalUserDto,
  UpdateInternalUserDto,
  UpdateUserStatusDto,
} from '../../../application/dtos/user.dtos';

@Controller({ path: 'users', version: '1' })
@ProtegerRuta(Rol.ADMIN_DIRECTOR)
export class UsersController {
  constructor(private readonly usersUseCases: UsersUseCases) {}

  @Post()
  async create(@Body() dto: CreateInternalUserDto) {
    try {
      return await this.usersUseCases.create(dto);
    } catch (error) {
      this.translateError(error);
    }
  }

  @Get()
  list() {
    return this.usersUseCases.list();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateInternalUserDto) {
    try {
      return await this.usersUseCases.update(id, dto);
    } catch (error) {
      this.translateError(error);
    }
  }

  @Patch(':id/status')
  async changeStatus(@Param('id') id: string, @Body() dto: UpdateUserStatusDto) {
    try {
      return await this.usersUseCases.changeStatus(id, dto.active);
    } catch (error) {
      this.translateError(error);
    }
  }

  private translateError(error: unknown): never {
    if (error instanceof UserConflictError) {
      throw new ConflictException(error.message);
    }
    if (error instanceof UserNotFoundError) {
      throw new NotFoundException(error.message);
    }
    throw error instanceof Error ? error : new Error('Error inesperado');
  }
}
