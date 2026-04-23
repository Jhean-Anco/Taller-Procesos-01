import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class TuberiaRecortarCadenas implements PipeTransform {
    transform(value: unknown, metadata: ArgumentMetadata): unknown;
    private normalizar;
}
