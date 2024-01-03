import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ClientLoginRequest } from "types/client.type";

export class JwtAccessStrategy extends PassportStrategy( Strategy, "access" ) {
    constructor ()
    {
        super( {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.ACCESS_TOKEN_SECRET_KEY,
        } );
    }

    static validate ( payload: ClientLoginRequest )
    {
        return {
            email: payload.email,
            password: payload.password
        }
    }
}