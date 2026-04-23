import { Type } from '@nestjs/common';
export declare function ApiRespuestaOk<TModelo extends Type<unknown>>(modelo: TModelo, descripcion: string): MethodDecorator & ClassDecorator;
export declare function ApiRespuestaListaOk<TModelo extends Type<unknown>>(modelo: TModelo, descripcion: string): MethodDecorator & ClassDecorator;
