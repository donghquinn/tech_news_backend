import { HackerController } from "@controllers/hacker/hacker.ctl";
import { PrismaLibrary } from "@libraries/common/prisma.lib";
import { HackersNewsProvider } from "@libraries/providers/news/hacker.lib";
import { Module } from "@nestjs/common";
import { LoggerProvider } from "@utils/logger.util";

@Module({
  controllers: [ HackerController ],
  providers: [ HackersNewsProvider, PrismaLibrary, LoggerProvider ],
})
export class HackerModule { }
