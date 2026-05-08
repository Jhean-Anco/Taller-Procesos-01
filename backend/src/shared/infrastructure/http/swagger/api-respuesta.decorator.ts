import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { MetaRespuestaApiDto, RespuestaApiBaseDto } from './respuesta-api.dto';

export function ApiRespuestaOk<TModelo extends Type<unknown>>(
  modelo: TModelo,
  descripcion: string,
): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiExtraModels(RespuestaApiBaseDto, MetaRespuestaApiDto, modelo),
    ApiOkResponse({
      description: descripcion,
      schema: {
        allOf: [
          { $ref: getSchemaPath(RespuestaApiBaseDto) },
          {
            type: 'object',
            properties: {
              data: {
                $ref: getSchemaPath(modelo),
              },
            },
            required: ['data'],
          },
        ],
      },
    }),
  );
}

export function ApiRespuestaListaOk<TModelo extends Type<unknown>>(
  modelo: TModelo,
  descripcion: string,
): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiExtraModels(RespuestaApiBaseDto, MetaRespuestaApiDto, modelo),
    ApiOkResponse({
      description: descripcion,
      schema: {
        allOf: [
          { $ref: getSchemaPath(RespuestaApiBaseDto) },
          {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  $ref: getSchemaPath(modelo),
                },
              },
            },
            required: ['data'],
          },
        ],
      },
    }),
  );
}
