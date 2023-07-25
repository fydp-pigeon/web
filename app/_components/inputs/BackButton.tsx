import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import Link from 'next/link';

type Props = {
  href: string;
  className?: string;
};

export function BackButton({ href, className }: Props) {
  return (
    <Link href={href} className={classNames("btn-neutral btn", className)}>
      <ArrowLeftIcon height={22} />
      Back
    </Link>
  );
}
