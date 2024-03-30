declare global {
  namespace NodeJs {
    interface ProcessEnv {
      APP_PORT: string;
      NODE_ENV: string;
      DATABASE_URL: string;

      SESSION_SECRET: string;

      SECRET_KEY: string;
      AUTH_KEY: string;

      REDIS_HOST: string;
      REDIS_PORT: number;
      REDIS_TIMEOUT: number;

      REDIS_USER: string;
      REDIS_PASS: string;

      GMAIL_USER: string;
      GMAIL_PASSWORD: string;
    }
  }
}
