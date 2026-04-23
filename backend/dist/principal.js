"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const aplicacion_module_1 = require("./aplicacion.module");
const configurar_aplicacion_1 = require("./configurar-aplicacion");
const configurar_documentacion_1 = require("./shared/infrastructure/http/configurar-documentacion");
async function bootstrap() {
    const app = await core_1.NestFactory.create(aplicacion_module_1.AplicacionModule);
    (0, configurar_aplicacion_1.configurarAplicacion)(app);
    (0, configurar_documentacion_1.configurarDocumentacion)(app);
    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
//# sourceMappingURL=principal.js.map