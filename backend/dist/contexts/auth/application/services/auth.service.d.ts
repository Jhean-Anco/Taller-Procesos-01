import { JwtService } from '@nestjs/jwt';
import { ConvivenciaService } from '../../../convivencia/application/services/convivencia.service';
import { UsuarioAutenticado } from '../../../../shared/infrastructure/auth/usuario-autenticado.interface';
export interface SolicitudLogin {
    correo: string;
    password: string;
}
export declare class AuthService {
    private readonly convivenciaService;
    private readonly jwtService;
    constructor(convivenciaService: ConvivenciaService, jwtService: JwtService);
    login(solicitud: SolicitudLogin): Promise<{
        accessToken: string;
        usuario: UsuarioAutenticado;
    }>;
}
