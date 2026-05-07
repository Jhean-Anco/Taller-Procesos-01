"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RutaPublica = exports.RUTA_PUBLICA_CLAVE = void 0;
const common_1 = require("@nestjs/common");
exports.RUTA_PUBLICA_CLAVE = 'rutaPublica';
const RutaPublica = () => (0, common_1.SetMetadata)(exports.RUTA_PUBLICA_CLAVE, true);
exports.RutaPublica = RutaPublica;
//# sourceMappingURL=ruta-publica.decorator.js.map