import prisma from "@/_lib/server/prismadb";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: {
        host: process.env.SENDGRID_SMTP_HOST,
        port: process.env.SENDGRID_SMTP_PORT,
        auth: {
          user: process.env.SENDGRID_SMTP_USER,
          pass: process.env.SENDGRID_SMTP_KEY,
        },
      },
      from: process.env.SENDGRID_FROM_EMAIL,
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
