import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configurarDocumentacion(app: INestApplication): void {
  if (process.env.SWAGGER_ENABLED === 'false') {
    return;
  }

  const documentoConfig = new DocumentBuilder()
    .setTitle('Backend de convivencia escolar')
    .setDescription(
      'API para autenticacion, convivencia escolar, alertas psicologicas e integracion con IA.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Autenticacion con token JWT en el header Authorization.',
      },
      'jwt',
    )
    .addCookieAuth(
      'safeschool.sid',
      {
        type: 'apiKey',
        in: 'cookie',
        description: 'Sesion HTTP gestionada por express-session.',
      },
      'sesion',
    )
    .build();

  const documento = SwaggerModule.createDocument(app, documentoConfig);

  SwaggerModule.setup('api/docs', app, documento, {
    swaggerOptions: {
      persistAuthorization: process.env.NODE_ENV !== 'production',
    },
  });
}
