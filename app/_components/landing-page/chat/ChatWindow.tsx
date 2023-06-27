'use client';

import { Image } from '@/_components/Image';
import { useClientUser } from '@/_lib/client/hooks/useClientUser';
import classNames from 'classnames';

type Props = {
  messages: string[];
  className?: string;
  isLoadingResponse?: boolean;
};

export function ChatWindow({ messages, className, isLoadingResponse }: Props) {
  const { user } = useClientUser({ allowUnauthenticated: true });

  return (
    <div className={classNames('flex flex-col gap-2', className)}>
      {messages.map((msg, i) => (
        <div key={i} className={classNames('chat', i % 2 === 1 ? 'chat-start' : 'chat-end')}>
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <Image src={i % 2 === 1 ? '/logo-white-bg.png' : user?.image || '/avatar.png'} alt="avatar" />
            </div>
          </div>
          <div className={classNames('chat-bubble', i % 2 == 1 ? 'bg-accent' : 'bg-primary')}>{msg}</div>
        </div>
      ))}
      {isLoadingResponse && (
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <Image src="/logo-white-bg.png" alt="avatar" />
            </div>
          </div>
          <div className="chat-bubble flex items-center justify-center bg-accent">
            <span className="loading loading-dots loading-md"></span>
          </div>
        </div>
      )}
    </div>
  );
}
