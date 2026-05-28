export function generarIdSeguro(prefijo: string): string {
  const aleatorio = Math.random().toString(36).slice(2, 10);
  return `${prefijo}_${Date.now().toString(36)}_${aleatorio}`;
}

export function generarCodigoReporte(): string {
  const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const aleatorio = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `AR-${fecha}-${aleatorio}`;
}
