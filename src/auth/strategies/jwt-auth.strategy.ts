import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtSecret } from "src/common/contants/constant.jwt";
import { Role } from "src/roles/entities/role.entity";

interface Payload {
    sub: string
    name: string
    rol: string
}

@Injectable()
export class JwStrategy extends PassportStrategy(Strategy){
    // El constructor configura la estrategia JWT
    constructor(){
        super({
            // Extraemos el token 
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // N ignoramos la expiracion del token
            ignoreExpiration: false,
            // Clave secreta para verificar la firma del token JWT
            secretOrKey: jwtSecret.secret
        });
    }

    // El método validate se utiliza para validar el paylood del toke JWT
    async validate(payload: Payload){
        return payload;
        // Retornamos un objeto que contiene las propiedades del paylood del token JWT
    //     const user = await this.authService.findOne(+payload._sub);
    // if (!user) {
    //   throw new Error("");
    // }
    // return user;
    }
}