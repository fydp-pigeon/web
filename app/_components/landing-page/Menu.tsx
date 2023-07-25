import Link from 'next/link';

export function Menu() {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="text-3xl">Pigeon</div>
      <Link href={'/signup'} className="btn-primary btn h-0 py-0">
        Sign up
      </Link>
    </div>
  );
}
