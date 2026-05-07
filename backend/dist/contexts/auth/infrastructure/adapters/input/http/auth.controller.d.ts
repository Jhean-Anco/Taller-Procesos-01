import type { Request, Response } from 'express';
import { AuthService } from '../../../../application/services/auth.service';
import { LoginDto } from './dto/login.dto';
import { UsuarioAutenticado } from '../../../../../../shared/infrastructure/auth/usuario-autenticado.interface';
type RequestConSesion = Request & {
    usuario?: UsuarioAutenticado;
    session?: {
        usuario?: UsuarioAutenticado;
        destroy(callback: (err?: unknown) => void): void;
    };
};
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: LoginDto, request: RequestConSesion): Promise<{
        accessToken: string;
        usuario: UsuarioAutenticado;
    }>;
    obtenerSesion(request: RequestConSesion): {
        usuario: UsuarioAutenticado;
    };
    logout(request: RequestConSesion, response: Response): Promise<{
        ok: true;
    }>;
}
export {};
