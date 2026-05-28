import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Rol } from '../../../../../shared/domain/enums/rol.enum';
import { ProtegerRuta } from '../../../../../shared/infrastructure/auth/proteger-ruta.decorator';
import { UsersUseCases } from '../../../application/use-cases/users.use-cases';
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
  create(@Body() dto: CreateInternalUserDto) {
    return this.usersUseCases.create(dto);
  }

  @Get()
  list() {
    return this.usersUseCases.list();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInternalUserDto) {
    return this.usersUseCases.update(id, dto);
  }

  @Patch(':id/status')
  changeStatus(@Param('id') id: string, @Body() dto: UpdateUserStatusDto) {
    return this.usersUseCases.changeStatus(id, dto.active);
  }
}
