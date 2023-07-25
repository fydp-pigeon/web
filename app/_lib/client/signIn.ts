import { signIn as nextAuthSignIn } from 'next-auth/react';
import { callBackend } from '@/_lib/client/callBackend';
import { ApiSignInBody } from '@/api/signin/_lib/signIn';

export const signIn = async ({ email }: { email: string }) => {
  await callBackend<{}, ApiSignInBody>({
    method: 'POST',
    url: '/api/signin',
    body: {
      email,
    },
  });

  return await nextAuthSignIn('email', {
    email,
    redirect: false,
  });
};
