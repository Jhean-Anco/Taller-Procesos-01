import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from 'node:crypto';

interface CipherPayload {
  keyId: string;
  iv: string;
  authTag: string;
  ciphertext: string;
}

export class ReportCryptoService {
  private readonly masterKey = this.resolveMasterKey();
  private readonly keyId = process.env.REPORTS_DATA_KEY_ID ?? process.env.NODE_ENV ?? 'default';

  encrypt(value: string): string {
    if (!value) return '';
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.masterKey, iv);
    const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
    const payload: CipherPayload = {
      keyId: this.keyId,
      iv: iv.toString('base64'),
      authTag: cipher.getAuthTag().toString('base64'),
      ciphertext: encrypted.toString('base64'),
    };
    return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64');
  }

  decrypt(payload: string | null | undefined): string {
    if (!payload) return '';
    try {
      const decoded = JSON.parse(
        Buffer.from(payload, 'base64').toString('utf8'),
      ) as CipherPayload;
      if (!decoded?.iv || !decoded?.authTag || !decoded?.ciphertext) {
        throw new Error('Invalid payload');
      }
      const iv = Buffer.from(decoded.iv, 'base64');
      const authTag = Buffer.from(decoded.authTag, 'base64');
      const decipher = createDecipheriv('aes-256-gcm', this.masterKey, iv);
      decipher.setAuthTag(authTag);
      return Buffer.concat([
        decipher.update(Buffer.from(decoded.ciphertext, 'base64')),
        decipher.final(),
      ]).toString('utf8');
    } catch {
      throw new Error('No fue posible descifrar el contenido protegido');
    }
  }

  private resolveMasterKey(): Buffer {
    const secret = process.env.REPORTS_DATA_KEY;
    if (!secret) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('REPORTS_DATA_KEY es obligatoria en production');
      }
      return scryptSync('safeschool-dev-report-key', 'safeschool-report-salt', 32);
    }
    if (/^[a-f0-9]{64}$/i.test(secret)) {
      return Buffer.from(secret, 'hex');
    }
    const decoded = Buffer.from(secret, 'base64');
    if (decoded.length !== 32) {
      throw new Error('REPORTS_DATA_KEY invalida');
    }
    return decoded;
  }
}
