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
