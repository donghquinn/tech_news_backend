import { MachineLearningError } from "@errors/machine.error";
import { PrismaLibrary } from "@libraries/common/prisma.lib";
import { Injectable, Logger } from "@nestjs/common";
import { endOfDay, startOfDay } from 'date-fns';
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
                    uuid: true,
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

    async giveStar(uuid: string) {
        try {
          Logger.debug("Give ML News Star Request: %o", {
            uuid
          });
    
          await this.prisma.machineNews.update({
            data: {
              starred: "1"
            },
            where: {
              uuid
            }
          });
    
          await this.prisma.onModuleDestroy();
    
          Logger.log("Starred Updated");
    
          return true;
        } catch (error) {
          throw new MachineLearningError(
            "Give Star on the ML news",
            "Failed to vie star ML news",
            error instanceof Error ? error : new Error(JSON.stringify(error)),
          )
        }
      }
    
      async unStar(uuid: string) {
        try {
          Logger.debug("Give ML News Star Request: %o", {
            uuid
          });
    
          await this.prisma.machineNews.update({
            data: {
              starred: "0"
            },
            where: {
              uuid
            }
          });
    
          await this.prisma.onModuleDestroy();
    
          Logger.log("Starred Updated");
    
          return true;
        } catch (error) {
          throw new MachineLearningError(
            "unStar on the news",
            "Failed to vie star news",
            error instanceof Error ? error : new Error(JSON.stringify(error)),
          )
        }
      }
    
      async bringStarredNews() {
        try {
          Logger.log("Request to get Starred ML News");
          
          const starredNews = await this.prisma.machineNews.findMany({
            select: {
              uuid: true, title: true, link: true, founded: true
            },
            orderBy: {
              founded: "desc"
            },
            where: {
              starred: "1"
            }
          });
    
          await this.prisma.onModuleDestroy();
    
          Logger.log("Founded Starred News");
    
          return starredNews;
        } catch (error) {
          throw new MachineLearningError(
            "Bring Starred BBC News",
            "Failed to Bring Starred BBC News",
            error instanceof Error ? error : new Error(JSON.stringify(error)),
          )
        }
      }
}