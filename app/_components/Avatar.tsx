import classNames from 'classnames';

type Props = {
  name: string;
  src?: string | null;
  className?: string;
};

export function Avatar({ src, name, className }: Props) {
  return src ? (
    <div className="avatar">
      <div className={classNames('rounded-full', className)}>
        <img src={src} alt="avatar" />
      </div>
    </div>
  ) : (
    <div className="avatar placeholder">
      <div className={classNames('w-16 select-none rounded-full bg-neutral text-2xl text-neutral-content', className)}>
        <span>{name[0]}</span>
      </div>
    </div>
  );
}
