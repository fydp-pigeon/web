import { getServerSession } from 'next-auth';
import SignOut from './_components/SignOut';
import { redirect } from 'next/navigation';
import { authOptions } from '@/api/auth/[...nextauth]/_lib/authOptions';

export default async function SignOutPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/');
  }

  return <SignOut />;
}
