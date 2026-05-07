import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configurarDocumentacion(app: INestApplication): void {
  // Se documentan ambos mecanismos soportados por el backend: JWT y sesión HTTP.
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
      'connect.sid',
      {
        type: 'apiKey',
        in: 'cookie',
        description: 'Sesion HTTP gestionada por express-session.',
      },
      'sesion',
    )
    .build();

  const documento = SwaggerModule.createDocument(app, documentoConfig);

  // Se publica una UI estable para desarrollo y validación manual del contrato HTTP.
  SwaggerModule.setup('api/docs', app, documento, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
