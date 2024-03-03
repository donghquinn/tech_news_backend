import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from 'app.module';
import helmet from 'helmet';
import { shutdown } from 'utils/shutdown.utils';

process.env.TZ = 'Asia/Seoul';

export const bootstrap = async () => {
  const date = new Date().toLocaleTimeString();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'debug', 'warn', 'error'],
  });

  const port = Number(process.env.APP_PORT);

  // const corsOptions: CorsOptions = {
  //   origin: 'https://scrape.donghyuns.com',
  //   allowedHeaders: ['GET', 'POST', 'Content-Type', 'key'],
  //   optionsSuccessStatus: 204,
  //   preflightContinue: false,
  // };

  app.use(helmet());
  app.enableCors();
  app.enableVersioning();
  app.useBodyParser('json');
  app.enableShutdownHooks();

  await app.listen(port, '0.0.0.0', () => {
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

await bootstrap();
