import { Injectable, Logger } from "@nestjs/common";
import { endOfDay, startOfDay } from 'date-fns';
import { MachineLearningError } from "errors/machine.error";
import { PrismaLibrary } from "libraries/common/prisma.lib";
import moment from "moment-timezone";

@Injectable()
export class MachineLearningProvider {
    constructor(private readonly prisma: PrismaLibrary){}

    async bringLatestMachineLearningNews(today: string){
        try {
            const yesterday = moment(today).subtract(1, 'day').toString();

            Logger.debug("Latest Machine Learning News: %o", {
                start: startOfDay(new Date(yesterday)),
                end: endOfDay(new Date(yesterday)),
            });
            
            const result = await this.prisma.machineNews.findMany({
                select: { 
                    category: true,
                    title: true, 
                    link: true, 
                    founded: true 
                },
                where: {
                  founded: {
                    gte: startOfDay(new Date(yesterday)),
                    lte: endOfDay(new Date(yesterday))
                  },
                },
              });
        
              await this.prisma.onModuleDestroy();
        
              return result;
        } catch (error) {
            throw new MachineLearningError(
                "Get Latest Machine Learning News",
                "Failed to Get Latest Machine Learning News",
                error instanceof Error ? error : new Error(JSON.stringify(error)),
            )
        }
    }
}