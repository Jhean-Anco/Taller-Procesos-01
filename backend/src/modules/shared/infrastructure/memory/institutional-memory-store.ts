import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PreventiveActivity } from '../../../activities/domain/entities/preventive-activity.entity';
import { Alert } from '../../../alerts/domain/entities/alert.entity';
import { AuditLog } from '../../../audit/domain/entities/audit-log.entity';
import { InternalUser } from '../../../users/domain/entities/internal-user.entity';
import {
  AiAnalysis,
  AnonymousReport,
  Derivation,
  PsychologicalReview,
} from '../../../reports/domain/entities/report.entity';
import { InternalUserRole } from '../../domain/enums';
import { generarIdSeguro } from '../../domain/id-generator';

@Injectable()
export class InstitutionalMemoryStore {
  readonly users: InternalUser[] = [
    new InternalUser({
      id: generarIdSeguro('usr'),
      name: 'Administrador PMV',
      email: 'admin@agora.edu.pe',
      passwordHash: bcrypt.hashSync('admin2024', 10),
      role: InternalUserRole.ADMIN_DIRECTOR,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    new InternalUser({
      id: generarIdSeguro('usr'),
      name: 'Psicologia PMV',
      email: 'psicologo@agora.edu.pe',
      passwordHash: bcrypt.hashSync('psicolog2024', 10),
      role: InternalUserRole.PSYCHOLOGIST,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  ];

  readonly reports: AnonymousReport[] = [];
  readonly analyses: AiAnalysis[] = [];
  readonly reviews: PsychologicalReview[] = [];
  readonly alerts: Alert[] = [];
  readonly derivations: Derivation[] = [];
  readonly activities: PreventiveActivity[] = [];
  readonly auditLogs: AuditLog[] = [];
}
