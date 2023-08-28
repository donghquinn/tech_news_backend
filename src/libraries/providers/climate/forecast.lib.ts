import { ForecastError } from '@errors/forecast.error';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { Injectable } from '@nestjs/common';
import { endOfDay, startOfDay } from 'date-fns';
import moment from 'moment-timezone';

@Injectable()
export class ForeCastProvider {
  constructor(private readonly prisma: PrismaLibrary) {}

  async getShortForecast(today: string) {
    try {
      const yesterday = moment(today).subtract(1, 'day').toString();

      const result = await this.prisma.foreCast.findMany({
        select: {
          date: true,
          rain: true,
          temperature: true,
          visibility: true,
          humidity: true,
          cloud: true,
          solarRadiation: true,
        },
        where: {
          founded: {
            gte: startOfDay(new Date(yesterday)),
            lte: endOfDay(new Date(yesterday)),
          },
        },
      });

      await this.prisma.onModuleDestroy();

      return result;
    } catch (error) {
      throw new ForecastError(
        'Short Forecast Provider',
        'Short Forecast Provider Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
