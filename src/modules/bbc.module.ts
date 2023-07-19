import { Module } from "@nestjs/common";
import { BbcController } from "controllers/bbc/bbc.ctl";
import { PrismaLibrary } from "libraries/common/prisma.lib";
import { BbcNewsProvider } from "libraries/providers/news/bbc.lib";

@Module({
  controllers: [ BbcController ],
  providers: [ BbcNewsProvider, PrismaLibrary ],
})
export class BbcModule { }
