import { ReactNode } from 'react';

type Props = {
  title: string;
  subtext?: string;
  rightContent?: ReactNode;
};

export function PageHeader({ title, subtext, rightContent }: Props) {
  return (
    <div className="flex w-full justify-between">
      <div className="space-y-1">
        <div className="text-3xl font-light">{title}</div>
        <div>{subtext}</div>
      </div>
      <div>{rightContent}</div>
    </div>
  );
}
