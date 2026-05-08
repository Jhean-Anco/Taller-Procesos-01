"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const aplicacion_modulo_1 = require("./aplicacion.modulo");
async function iniciar() {
    const aplicacion = await core_1.NestFactory.create(aplicacion_modulo_1.AplicacionModulo);
    aplicacion.enableCors();
    aplicacion.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    const puerto = Number(process.env.PUERTO ?? 3000);
    await aplicacion.listen(puerto);
}
void iniciar();
//# sourceMappingURL=principal.js.map