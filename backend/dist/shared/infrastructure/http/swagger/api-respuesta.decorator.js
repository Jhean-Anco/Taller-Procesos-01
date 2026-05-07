"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRespuestaOk = ApiRespuestaOk;
exports.ApiRespuestaListaOk = ApiRespuestaListaOk;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const respuesta_api_dto_1 = require("./respuesta-api.dto");
function ApiRespuestaOk(modelo, descripcion) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(respuesta_api_dto_1.RespuestaApiBaseDto, respuesta_api_dto_1.MetaRespuestaApiDto, modelo), (0, swagger_1.ApiOkResponse)({
        description: descripcion,
        schema: {
            allOf: [
                { $ref: (0, swagger_1.getSchemaPath)(respuesta_api_dto_1.RespuestaApiBaseDto) },
                {
                    type: 'object',
                    properties: {
                        data: {
                            $ref: (0, swagger_1.getSchemaPath)(modelo),
                        },
                    },
                    required: ['data'],
                },
            ],
        },
    }));
}
function ApiRespuestaListaOk(modelo, descripcion) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(respuesta_api_dto_1.RespuestaApiBaseDto, respuesta_api_dto_1.MetaRespuestaApiDto, modelo), (0, swagger_1.ApiOkResponse)({
        description: descripcion,
        schema: {
            allOf: [
                { $ref: (0, swagger_1.getSchemaPath)(respuesta_api_dto_1.RespuestaApiBaseDto) },
                {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                $ref: (0, swagger_1.getSchemaPath)(modelo),
                            },
                        },
                    },
                    required: ['data'],
                },
            ],
        },
    }));
}
//# sourceMappingURL=api-respuesta.decorator.js.map