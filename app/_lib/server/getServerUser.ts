import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { User } from '@prisma/client';
import { authOptions } from '@/api/auth/[...nextauth]/_lib/authOptions';

export const getServerUser = async (): Promise<User> => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/signin');
  }

  return session.user as User;
};
