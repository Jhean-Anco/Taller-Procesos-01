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
