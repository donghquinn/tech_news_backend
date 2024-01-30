import { Injectable } from "@nestjs/common";
import { ClientLoginMapItem, ClientLoginMapKey } from "types/client.type";

@Injectable()
export class AccountManager
{
    private userMap: WeakMap<ClientLoginMapKey, ClientLoginMapItem>;

    constructor ()
    { 
        this.userMap = new WeakMap()
    }
    
    public setItem ( uuid: string, email: string )
    {
        this.userMap.set( { uuid }, { email } );
    }
}