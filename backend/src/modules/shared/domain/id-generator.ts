import { randomBytes, randomUUID } from 'node:crypto';

export function generarIdSeguro(prefijo: string): string {
  return `${prefijo}_${randomUUID().replace(/-/g, '')}`;
}

export function generarCodigoReporte(): string {
  const aleatorio = randomBytes(9).toString('base64url').toUpperCase();
  return `AR-${aleatorio.slice(0, 12)}`;
}
