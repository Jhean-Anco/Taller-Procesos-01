import { Request } from 'express';
import { IaService } from '../../../../application/services/ia.service';
import { GenerarTextoDto } from './dto/generar-texto.dto';
import { UsuarioAutenticado } from '../../../../../../shared/infrastructure/auth/usuario-autenticado.interface';
type PeticionConUsuario = Request & {
    usuario: UsuarioAutenticado;
};
export declare class IaControlador {
    private readonly iaService;
    constructor(iaService: IaService);
    generarTexto(body: GenerarTextoDto, request: PeticionConUsuario): Promise<import("../../../../domain/entities/respuesta-ia.entidad").RespuestaIa>;
}
export {};
