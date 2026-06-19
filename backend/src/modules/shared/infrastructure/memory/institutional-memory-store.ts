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

function bootstrapHash(password: string | undefined): string {
  if (!password) {
    if (process.env.NODE_ENV === 'test') {
      return bcrypt.hashSync('test-bootstrap-password', 10);
    }
    throw new Error('BOOTSTRAP_ADMIN_PASSWORD es obligatoria para la memoria institucional');
  }
  return bcrypt.hashSync(password, 10);
}

@Injectable()
export class InstitutionalMemoryStore {
  readonly users: InternalUser[] = [
    new InternalUser({
      id: generarIdSeguro('usr'),
      name: process.env.BOOTSTRAP_ADMIN_NAME ?? 'Administrador PMV',
      email: process.env.BOOTSTRAP_ADMIN_EMAIL ?? 'admin@localhost',
      passwordHash: bootstrapHash(process.env.BOOTSTRAP_ADMIN_PASSWORD),
      role: InternalUserRole.ADMIN_DIRECTOR,
      active: true,
      tokenVersion: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    new InternalUser({
      id: generarIdSeguro('usr'),
      name: 'Psicologia PMV',
      email: process.env.BOOTSTRAP_PSYCHOLOGIST_EMAIL ?? 'psicologo@localhost',
      passwordHash: process.env.BOOTSTRAP_PSYCHOLOGIST_PASSWORD
        ? bootstrapHash(process.env.BOOTSTRAP_PSYCHOLOGIST_PASSWORD)
        : bcrypt.hashSync(process.env.NODE_ENV === 'test' ? 'test-bootstrap-password' : 'psicologo-bootstrap-password', 10),
      role: InternalUserRole.PSYCHOLOGIST,
      active: true,
      tokenVersion: 0,
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
