"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtegerRuta = exports.ROLES_RUTA_CLAVE = void 0;
const common_1 = require("@nestjs/common");
exports.ROLES_RUTA_CLAVE = 'rolesRuta';
const ProtegerRuta = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_RUTA_CLAVE, roles);
exports.ProtegerRuta = ProtegerRuta;
//# sourceMappingURL=proteger-ruta.decorator.js.map