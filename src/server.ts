import { Logger } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from 'app.module';
import helmet from 'helmet';
import { AccountManager } from 'providers/account-manager.pvd';
import { shutdown } from 'utils/shutdown.utils';

export const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'debug', 'warn', 'error'],
  });

  const port = Number(process.env.APP_PORT);

  const accountManager = new AccountManager();
  await accountManager.start();

  const corsOptions: CorsOptions = {
    origin: '*',
    allowedHeaders: ['GET', 'POST', 'Content-Type', 'key'],
    optionsSuccessStatus: 204,
    preflightContinue: false,
  };

  app.use(helmet());
  app.enableCors(corsOptions);
  app.enableVersioning();
  app.useBodyParser('json');
  app.enableShutdownHooks();

  await app.listen(port, '0.0.0.0', () => {
    const date = new Date().toLocaleTimeString();
    const message = `Listening On ${port}`;
    const wrapper = '@'.repeat(message.length);

    Logger.log(wrapper);
    Logger.log(`Scrape Manager Start: ${date}`);
    Logger.log(message);
    Logger.log(wrapper);

    process.send?.('ready');
  });

  process.on('SIGTERM', () => shutdown(app));
};
