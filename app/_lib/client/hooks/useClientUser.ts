import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { User } from '@prisma/client';

type Props = {
  allowUnauthenticated?: boolean;
};

export const useClientUser = ({ allowUnauthenticated = false }: Props = {}) => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!allowUnauthenticated && session.status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [session.status, router, allowUnauthenticated]);

  if (session.status === 'loading' || !session.data?.user) {
    return { isLoading: true };
  }

  return { isLoading: false, user: session.data.user as User };
};
