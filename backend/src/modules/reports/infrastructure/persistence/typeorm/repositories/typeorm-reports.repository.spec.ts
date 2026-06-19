import { ReportStatus } from '../../../../../shared/domain/enums';
import { ReportCryptoService } from '../../../../domain/services/report-crypto.service';
import { AnonymousReportOrmEntity } from '../entities/anonymous-report.orm-entity';
import { TypeOrmReportsRepository } from './typeorm-reports.repository';

describe('TypeOrmReportsRepository', () => {
  const key = Buffer.alloc(32, 3).toString('base64');

  const createRepository = () => {
    const reports = {
      save: jest.fn(),
      findOneBy: jest.fn(),
      createQueryBuilder: jest.fn(),
      manager: {
        transaction: jest.fn(),
      },
    };
    const analyses = { save: jest.fn(), findOne: jest.fn() };
    const reviews = { save: jest.fn(), delete: jest.fn(), findOne: jest.fn() };
    const derivations = { save: jest.fn(), findOne: jest.fn() };
    const crypto = new ReportCryptoService();
    return new TypeOrmReportsRepository(
      reports as never,
      analyses as never,
      reviews as never,
      derivations as never,
      crypto,
    );
  };

  beforeEach(() => {
    process.env.REPORTS_DATA_KEY = key;
  });

  it('cifra y reconstruye un reporte sin perder texto', () => {
    const repository = createRepository();
    const report = {
      id: 'rep_1',
      publicCode: 'PUB-1',
      gradeReference: 'secundaria-3',
      sectionReference: 'A',
      ageRange: '12-14',
      emotionalForm: { fear: true },
      messageText: 'Mensaje sensible',
      consentAccepted: true,
      status: ReportStatus.PENDING,
      analysisQueueStatus: 'PENDING',
      analysisAttempts: 0,
      analysisRequestedAt: new Date('2025-01-01T00:00:00.000Z'),
      createdAt: new Date('2025-01-01T00:00:00.000Z'),
      updatedAt: new Date('2025-01-01T00:00:00.000Z'),
      toPrimitives: () => ({
        id: 'rep_1',
        publicCode: 'PUB-1',
        gradeReference: 'secundaria-3',
        sectionReference: 'A',
        ageRange: '12-14',
        emotionalForm: { fear: true },
        messageText: 'Mensaje sensible',
        consentAccepted: true,
        status: ReportStatus.PENDING,
        analysisQueueStatus: 'PENDING',
        analysisAttempts: 0,
        analysisNextAttemptAt: null,
        analysisLastError: null,
        analysisRequestedAt: new Date('2025-01-01T00:00:00.000Z'),
        analysisWorkerId: null,
        analysisAcquiredAt: null,
        archivedAt: null,
        archivedBy: null,
        archiveReason: null,
        archiveStatus: 'ACTIVE',
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-01T00:00:00.000Z'),
      }),
    } as never;

    const orm = (repository as any).reportToOrm(report);
    expect(orm.emotionalFormCiphertext).toBeTruthy();
    expect(orm.messageTextCiphertext).toBeTruthy();

    const roundtrip = (repository as any).reportToDomain({
      ...orm,
      emotionalFormCiphertext: orm.emotionalFormCiphertext,
      messageTextCiphertext: orm.messageTextCiphertext,
    } as AnonymousReportOrmEntity);

    expect(roundtrip.messageText).toBe('Mensaje sensible');
    expect(roundtrip.emotionalForm).toEqual({ fear: true });
  });

  it('marca trabajos pendientes como processing dentro de la transaccion', async () => {
    const repository = createRepository();
    const crypto = new ReportCryptoService();
    const report = {
      id: 'rep_1',
      publicCode: 'PUB-1',
      gradeReference: null,
      sectionReference: null,
      ageRange: null,
      emotionalFormCiphertext: crypto.encrypt(JSON.stringify({ fear: true })),
      messageTextCiphertext: crypto.encrypt('hola'),
      consentAccepted: true,
      status: ReportStatus.PENDING,
      analysisQueueStatus: 'PENDING',
      analysisAttempts: 0,
      analysisRequestedAt: new Date('2025-01-01T00:00:00.000Z'),
      createdAt: new Date('2025-01-01T00:00:00.000Z'),
      updatedAt: new Date('2025-01-01T00:00:00.000Z'),
    } as AnonymousReportOrmEntity;

    const manager = {
      createQueryBuilder: jest.fn().mockReturnValue({
        setLock: jest.fn().mockReturnThis(),
        setOnLocked: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([report]),
      }),
      save: jest.fn().mockImplementation(async (_entity: unknown, entity: any) => ({
        ...report,
        ...entity,
        analysisQueueStatus: 'PROCESSING',
        analysisAttempts: 1,
        analysisWorkerId: 'worker-local',
        analysisAcquiredAt: new Date('2025-01-02T00:00:00.000Z'),
      })),
    };

    (repository as any).reports.manager.transaction.mockImplementation(async (callback: any) =>
      callback(manager),
    );

    const acquired = await repository.claimPendingAnalysisJobs(1);

    expect(acquired).toHaveLength(1);
    expect(acquired[0].analysisQueueStatus).toBe('PROCESSING');
    expect((repository as any).reports.manager.transaction).toHaveBeenCalledTimes(1);
  });
});
