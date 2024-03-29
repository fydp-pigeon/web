'use client';

import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  text: string;
  href: string;
  isPrimary?: boolean;
};

export function SidebarItem({ icon, text, href, isPrimary }: Props) {
  const path = usePathname();

  return (
    <li>
      <Link
        href={href}
        className={classNames({ active: path === href, 'bg-primary text-white hover:bg-primary': isPrimary })}
      >
        {icon}
        {text}
      </Link>
    </li>
  );
}
