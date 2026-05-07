"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurarAplicacion = configurarAplicacion;
const common_1 = require("@nestjs/common");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const rutas_api_constantes_1 = require("./shared/infrastructure/http/rutas-api.constantes");
function configurarAplicacion(app) {
    const appHttp = app.getHttpAdapter().getInstance();
    appHttp.set('trust proxy', 1);
    app.use((0, cookie_parser_1.default)());
    app.use((0, express_session_1.default)({
        secret: process.env.SESSION_SECRET ?? 'session-secret-dev',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: 1000 * 60 * 60 * 8,
        },
    }));
    app.setGlobalPrefix(rutas_api_constantes_1.RUTAS_API.prefijo);
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: rutas_api_constantes_1.RUTAS_API.version,
    });
}
//# sourceMappingURL=configurar-aplicacion.js.map