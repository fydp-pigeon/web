declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      SENDGRID_FROM_EMAIL: string;
      SENDGRID_SMTP_USER: string;
      SENDGRID_SMTP_KEY: string;
      SENDGRID_SMTP_HOST: string;
      SENDGRID_SMTP_PORT: string;
    }
  }
}

export {};
