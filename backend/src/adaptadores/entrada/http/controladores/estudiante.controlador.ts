import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RegistrarEstudianteDto } from '../../../../aplicacion/dto/registrar-estudiante.dto';
import { RegistrarEstudianteCasoUso } from '../../../../aplicacion/puertos/entrada/registrar-estudiante.caso-uso';
import { Roles } from '../decoradores/roles.decorador';
import { JwtGuard } from '../guardias/jwt.guard';
import { RolesGuard } from '../guardias/roles.guard';

@Controller('estudiantes')
export class EstudianteControlador {
  constructor(
    private readonly registrarEstudianteCasoUso: RegistrarEstudianteCasoUso,
  ) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('administrativo')
  @Post()
  registrar(@Body() dto: RegistrarEstudianteDto) {
    return this.registrarEstudianteCasoUso.registrar(dto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('psicologo', 'administrativo')
  @Get()
  listar() {
    return this.registrarEstudianteCasoUso.listar();
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('psicologo', 'administrativo')
  @Get(':id')
  async obtener(@Param('id') id: string) {
    const estudiante = await this.registrarEstudianteCasoUso.obtenerPorId(id);

    if (!estudiante) {
      throw new NotFoundException('El estudiante no existe');
    }

    return estudiante;
  }
}
