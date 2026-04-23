"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RUTAS_API = void 0;
exports.RUTAS_API = {
    prefijo: 'api',
    version: '1',
    salud: {
        base: 'salud',
    },
    auth: {
        base: 'auth',
        login: 'login',
        sesion: 'sesion',
        logout: 'logout',
    },
    ia: {
        base: 'ia',
        generarTexto: 'generaciones',
    },
    convivencia: {
        base: 'convivencia',
        usuariosInstitucionales: 'usuarios-institucionales',
        reportesAnonimos: 'reportes-anonimos',
        incidencias: 'incidencias',
        intervenciones: 'intervenciones',
        materiales: 'materiales',
        alertasCriticas: 'alertas-criticas',
        estadisticasClima: 'estadisticas/clima-escolar',
        atencionesManuales: 'atenciones-manuales',
        iaMateriales: 'ia/materiales',
        iaRecomendaciones: 'ia/recomendaciones',
    },
};
//# sourceMappingURL=rutas-api.constantes.js.map