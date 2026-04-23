import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SaludService } from '../../../../application/services/salud.service';
import { Salud } from '../../../../domain/entities/salud.entidad';
import { RutaPublica } from '../../../../../../shared/infrastructure/auth/ruta-publica.decorator';
import { RUTAS_API } from '../../../../../../shared/infrastructure/http/rutas-api.constantes';
import { ApiRespuestaOk } from '../../../../../../shared/infrastructure/http/swagger/api-respuesta.decorator';
import { SaludSwaggerDto } from './dto/salud.swagger.dto';

@Controller({
  path: RUTAS_API.salud.base,
  version: RUTAS_API.version,
})
@ApiTags('Salud')
export class SaludControlador {
  constructor(private readonly saludService: SaludService) {}

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
}
