export abstract class CifradorClavePuerto {
  abstract generarHash(textoPlano: string): Promise<string>;
  abstract comparar(textoPlano: string, hash: string): Promise<boolean>;
}
