import classNames from 'classnames';
import { ReactNode } from 'react';

type Props = {
  title?: string;
  className?: string;
  actions?: ReactNode;
  children?: ReactNode;
};

export function Card({ title, className, actions, children }: Props) {
  return (
    <div className={classNames('card w-full bg-base-200 shadow-xl', className)}>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {children}
        <div className="card-actions justify-end">{actions}</div>
      </div>
    </div>
  );
}
