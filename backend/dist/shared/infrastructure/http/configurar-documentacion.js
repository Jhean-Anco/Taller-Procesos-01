"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurarDocumentacion = configurarDocumentacion;
const swagger_1 = require("@nestjs/swagger");
function configurarDocumentacion(app) {
    const documentoConfig = new swagger_1.DocumentBuilder()
        .setTitle('Backend de convivencia escolar')
        .setDescription('API para autenticacion, convivencia escolar, alertas psicologicas e integracion con IA.')
        .setVersion('1.0.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Autenticacion con token JWT en el header Authorization.',
    }, 'jwt')
        .addCookieAuth('connect.sid', {
        type: 'apiKey',
        in: 'cookie',
        description: 'Sesion HTTP gestionada por express-session.',
    }, 'sesion')
        .build();
    const documento = swagger_1.SwaggerModule.createDocument(app, documentoConfig);
    swagger_1.SwaggerModule.setup('api/docs', app, documento, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
}
//# sourceMappingURL=configurar-documentacion.js.map