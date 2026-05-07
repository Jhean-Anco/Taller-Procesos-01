<<<<<<< HEAD
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AplicacionModulo } from './aplicacion.modulo';

async function iniciar() {
  const aplicacion = await NestFactory.create(AplicacionModulo);
  aplicacion.enableCors();
  aplicacion.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const puerto = Number(process.env.PUERTO ?? 3000);
  await aplicacion.listen(puerto);
}

void iniciar();
=======
import { NestFactory } from '@nestjs/core';
import { AplicacionModule } from './aplicacion.module';
import { configurarAplicacion } from './configurar-aplicacion';
import { configurarDocumentacion } from './shared/infrastructure/http/configurar-documentacion';

async function bootstrap() {
  const app = await NestFactory.create(AplicacionModule);
  configurarAplicacion(app);
  configurarDocumentacion(app);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
>>>>>>> 863922cbcd111a3017c42c50aab51d40d8bf0f74
