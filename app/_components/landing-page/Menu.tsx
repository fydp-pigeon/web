import { authOptions } from '@/api/auth/[...nextauth]/_lib/authOptions';
import Link from 'next/link';
import { getServerSession } from 'next-auth';

export async function Menu() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className="flex w-full items-center justify-between">
      <div className="text-3xl">Pigeon</div>
      <Link href={user ? '/dashboard' : '/signup'} className="btn btn-primary h-0 py-0">
        {user ? 'Dashboard' : 'Sign up'}
      </Link>
    </div>
  );
}
