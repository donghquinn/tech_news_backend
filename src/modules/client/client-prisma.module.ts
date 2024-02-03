import { Module } from "@nestjs/common";
import { ClientPrismaLibrary } from "providers/client/client-prisma.pvd";

@Module( {
    providers: [ ClientPrismaLibrary ],
    exports: [ClientPrismaLibrary],
}) export class ClientPrismaModule {}