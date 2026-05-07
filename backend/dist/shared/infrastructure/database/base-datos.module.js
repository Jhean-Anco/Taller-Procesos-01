"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ModuloBaseDatos_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuloBaseDatos = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
let ModuloBaseDatos = ModuloBaseDatos_1 = class ModuloBaseDatos {
    static registrar() {
        const habilitado = process.env.DATABASE_ENABLED === 'true';
        return {
            module: ModuloBaseDatos_1,
            imports: habilitado
                ? [
                    typeorm_1.TypeOrmModule.forRootAsync({
                        imports: [config_1.ConfigModule],
                        inject: [config_1.ConfigService],
                        useFactory: (configService) => ({
                            type: 'postgres',
                            host: configService.get('DATABASE_HOST'),
                            port: Number(configService.get('DATABASE_PORT')),
                            username: configService.get('DATABASE_USERNAME'),
                            password: configService.get('DATABASE_PASSWORD'),
                            database: configService.get('DATABASE_NAME'),
                            autoLoadEntities: true,
                            synchronize: configService.get('DATABASE_SYNC') === 'true',
                            ssl: configService.get('DATABASE_SSL') === 'true'
                                ? { rejectUnauthorized: false }
                                : false,
                        }),
                    }),
                ]
                : [],
        };
    }
};
exports.ModuloBaseDatos = ModuloBaseDatos;
exports.ModuloBaseDatos = ModuloBaseDatos = ModuloBaseDatos_1 = __decorate([
    (0, common_1.Module)({
        imports: [],
    })
], ModuloBaseDatos);
//# sourceMappingURL=base-datos.module.js.map