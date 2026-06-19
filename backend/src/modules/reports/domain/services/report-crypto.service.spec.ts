import { ReportCryptoService } from './report-crypto.service';

describe('ReportCryptoService', () => {
  const key = Buffer.alloc(32, 2).toString('base64');

  beforeEach(() => {
    process.env.REPORTS_DATA_KEY = key;
  });

  it('cifra y descifra', () => {
    const crypto = new ReportCryptoService();
    const payload = crypto.encrypt('mensaje sensible');
    expect(crypto.decrypt(payload)).toBe('mensaje sensible');
  });

  it('rechaza manipular authTag', () => {
    const crypto = new ReportCryptoService();
    const payload = JSON.parse(Buffer.from(crypto.encrypt('hola'), 'base64').toString('utf8'));
    payload.authTag = Buffer.alloc(16, 9).toString('base64');
    const tampered = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64');
    expect(() => crypto.decrypt(tampered)).toThrow();
  });

  it('rechaza payload invalido', () => {
    const crypto = new ReportCryptoService();
    expect(() => crypto.decrypt('no-base64')).toThrow();
  });

  it('rechaza clave invalida', () => {
    process.env.REPORTS_DATA_KEY = 'abc';
    expect(() => new ReportCryptoService()).toThrow();
  });
});
