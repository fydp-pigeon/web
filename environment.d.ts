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
      OPENAI_API_KEY: string;
      PINECONE_API_KEY: string;
      PINECONE_ENVIRONMENT: string;
      PINECONE_INDEX: string;
      PINECONE_BASE_URL: string;
      CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
    }
  }
}

declare module 'next-auth' {
  export interface Session {
    user: User | null;
  }
}

export {};
