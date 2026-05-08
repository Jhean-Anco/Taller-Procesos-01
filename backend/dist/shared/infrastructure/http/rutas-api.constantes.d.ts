export declare const RUTAS_API: {
    readonly prefijo: "api";
    readonly version: "1";
    readonly salud: {
        readonly base: "salud";
    };
    readonly auth: {
        readonly base: "auth";
        readonly login: "login";
        readonly sesion: "sesion";
        readonly logout: "logout";
    };
    readonly ia: {
        readonly base: "ia";
        readonly generarTexto: "generaciones";
    };
    readonly convivencia: {
        readonly base: "convivencia";
        readonly usuariosInstitucionales: "usuarios-institucionales";
        readonly reportesAnonimos: "reportes-anonimos";
        readonly incidencias: "incidencias";
        readonly intervenciones: "intervenciones";
        readonly materiales: "materiales";
        readonly alertasCriticas: "alertas-criticas";
        readonly estadisticasClima: "estadisticas/clima-escolar";
        readonly atencionesManuales: "atenciones-manuales";
        readonly iaMateriales: "ia/materiales";
        readonly iaRecomendaciones: "ia/recomendaciones";
    };
};
