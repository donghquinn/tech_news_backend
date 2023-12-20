import { ForecastError } from '@errors/forecast.error';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { Injectable } from '@nestjs/common';
import { ClimateLogger } from '@utils/logger.util';
import { endOfDay, startOfDay } from 'date-fns';
import moment from 'moment-timezone';

@Injectable()
export class ForeCastProvider {
  constructor(private readonly prisma: PrismaLibrary) {}

  async getShortForecast(today: string) {
    try {
      const yesterday = moment(today).subtract(1, 'day').toString();

      const result = await this.prisma.forecast.findMany({
        select: {
          date: true,
          rain: true,
          temperature: true,
          visibility: true,
          humidity: true,
          totalCloud: true,
          solarRadiation: true,
        },
        where: {
          created: {
            gte: startOfDay(new Date(yesterday)),
            lte: endOfDay(new Date(yesterday)),
          },
        },
      });

      return result;
    } catch (error) {
      ClimateLogger.error('[Forecast] Bring Today News Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new ForecastError(
        'Short Forecast Provider',
        'Short Forecast Provider Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
