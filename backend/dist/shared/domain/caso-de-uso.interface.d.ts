export interface CasoDeUso<Salida = void, Argumentos extends unknown[] = []> {
    ejecutar(...args: Argumentos): Salida | Promise<Salida>;
}
