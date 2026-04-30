import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CifradorClavePuerto } from '../../../aplicacion/puertos/salida/cifrador-clave.puerto';

@Injectable()
export class BcryptCifradorClaveAdaptador implements CifradorClavePuerto {
  generarHash(textoPlano: string): Promise<string> {
    return bcrypt.hash(textoPlano, 10);
  }

  comparar(textoPlano: string, hash: string): Promise<boolean> {
    return bcrypt.compare(textoPlano, hash);
  }
}
