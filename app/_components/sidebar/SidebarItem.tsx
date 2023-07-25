import { getServerUrl } from '@/_lib/server/getServerUrl';
import classNames from 'classnames';
import Link from 'next/link';
import { ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  text: string;
  href: string;
  isPrimary?: boolean;
};

export function SidebarItem({ icon, text, href, isPrimary }: Props) {
  const path = getServerUrl().pathname;

  return (
    <li>
      <Link href={href} className={classNames({ active: path.includes(href), 'btn-primary': isPrimary })}>
        {icon}
        {text}
      </Link>
    </li>
  );
}
