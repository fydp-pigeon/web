import { Sidebar } from '@/_components/sidebar/Sidebar';
import { Suspense } from 'react';
import { LoadScreen } from '@/_components/LoadScreen';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/api/auth/[...nextauth]/route';

export const metadata = {
  title: 'Pigeon',
  description: "Interact in real-time with the city of Toronto's data",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/signin');
  }

  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="my-drawer" className="drawer-button fixed m-5 cursor-pointer space-y-1.5">
          <Bars3Icon height={40} />
        </label>
        <main className="flex h-screen w-screen justify-center">
          <div className="my-auto flex h-min w-full flex-col items-center p-10">
            <div className="h-full w-full space-y-4 overflow-y-auto p-1 xl:w-4/5 2xl:w-3/5">
              <Suspense fallback={<LoadScreen />}>{children}</Suspense>
            </div>
          </div>
        </main>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu h-full w-80 bg-base-200 p-4 text-base-content">
          <Sidebar />
        </ul>
      </div>
    </div>
  );
}
