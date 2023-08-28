declare global {
  namespace NodeJs {
    interface ProcessEnv {
      APP_PORT: string;

      SESSION_SECRET: string;
      AUTH_KEY: string;
    }
  }
}
