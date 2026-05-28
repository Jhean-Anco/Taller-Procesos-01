import { Controller, Get } from '@nestjs/common';
import { Rol } from '../../../../../shared/domain/enums/rol.enum';
import { ProtegerRuta } from '../../../../../shared/infrastructure/auth/proteger-ruta.decorator';
import { AuditService } from '../../../application/use-cases/audit.service';

@Controller({ path: 'audit-logs', version: '1' })
@ProtegerRuta(Rol.ADMIN_DIRECTOR)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  list() {
    return this.auditService.list();
  }
}
