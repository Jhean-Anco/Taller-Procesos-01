import { Controller, Get, Optional } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SaludService } from '../../../../application/services/salud.service';
import { Salud } from '../../../../domain/entities/salud.entidad';
import { RutaPublica } from '../../../../../../shared/infrastructure/auth/ruta-publica.decorator';
import { RUTAS_API } from '../../../../../../shared/infrastructure/http/rutas-api.constantes';
import { ApiRespuestaOk } from '../../../../../../shared/infrastructure/http/swagger/api-respuesta.decorator';
import { SaludSwaggerDto } from './dto/salud.swagger.dto';
import { DataSource } from 'typeorm';

@Controller({
  path: RUTAS_API.salud.base,
  version: RUTAS_API.version,
})
@ApiTags('Salud')
export class SaludControlador {
  constructor(
    private readonly saludService: SaludService,
    @Optional() private readonly dataSource?: DataSource,
  ) {}

  @Get()
  @RutaPublica()
  @ApiOperation({
    summary: 'Verifica el estado del servicio',
    description: 'Endpoint publico de salud para monitoreo y pruebas.',
  })
  @ApiRespuestaOk(SaludSwaggerDto, 'Estado actual del servicio.')
  obtenerSalud(): Promise<Salud> {
    return this.saludService.obtenerSalud();
  }

  @Get('db')
  @RutaPublica()
  @ApiOperation({
    summary: 'Verifica el estado de la base de datos',
    description: 'Comprueba la conexion real con PostgreSQL cuando esta habilitada.',
  })
  @ApiRespuestaOk(SaludSwaggerDto, 'Estado de la base de datos.')
  async obtenerSaludBaseDatos(): Promise<Salud> {
    if (!this.dataSource) {
      return new Salud('unavailable', 'database-disabled');
    }

    const isConnected = this.dataSource.isInitialized;
    if (!isConnected) {
      await this.dataSource.initialize();
    }
    await this.dataSource.query('SELECT 1');
    return new Salud('ok', 'postgres');
  }

  @Get('ai')
  @RutaPublica()
  @ApiOperation({
    summary: 'Verifica el estado del servicio de IA',
    description: 'Refleja la configuracion y disponibilidad declarada del servicio de analisis.',
  })
  @ApiRespuestaOk(SaludSwaggerDto, 'Estado del servicio de IA.')
  obtenerSaludIA(): Salud {
    const service = process.env.AI_SERVICE_URL ?? 'http://127.0.0.1:8000/analyze';
    const status = process.env.AI_SERVICE_REQUIRED === 'true' ? 'required' : 'configured';
    return new Salud(status, service);
  }
}
