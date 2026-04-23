import { SetMetadata } from '@nestjs/common';

export const RUTA_PUBLICA_CLAVE = 'rutaPublica';

export const RutaPublica = () => SetMetadata(RUTA_PUBLICA_CLAVE, true);
