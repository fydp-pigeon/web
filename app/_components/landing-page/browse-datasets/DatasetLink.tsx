import Link from 'next/link';
import { ReactNode } from 'react';

type Props = {
  href: string;
  children?: ReactNode;
};

export function DatasetLink({ href, children }: Props) {
  return (
    <Link href={href} className="flex h-24 items-center justify-center rounded-lg bg-primary text-primary-content">
      {children}
    </Link>
  );
}
