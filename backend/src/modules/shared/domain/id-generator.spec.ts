import { generarCodigoReporte, generarIdSeguro } from './id-generator';

describe('id-generator', () => {
  it('genera ids con prefijo y suficiente entropia', () => {
    const id1 = generarIdSeguro('rep');
    const id2 = generarIdSeguro('rep');
    expect(id1.startsWith('rep_')).toBe(true);
    expect(id1).not.toBe(id2);
  });

  it('genera codigo publico no predecible', () => {
    const code = generarCodigoReporte();
    expect(code.startsWith('AR-')).toBe(true);
    expect(code.length).toBeGreaterThanOrEqual(8);
  });
});
