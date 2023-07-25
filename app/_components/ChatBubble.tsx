'use client';

import classNames from 'classnames';
import { Image } from '@/_components/Image';
import { useClientUser } from '@/_lib/client/hooks/useClientUser';
import ReactMarkdown from 'react-markdown';
import { ReactNode } from 'react';

type Props = {
  role: 'ai' | 'user';
} & ({ message: string; isLoading?: false } | { message?: string; isLoading: true });

export function ChatBubble({ role, message, isLoading }: Props) {
  const { user } = useClientUser({ allowUnauthenticated: true });

  return (
    <div className={classNames('chat', role === 'ai' ? 'chat-start' : 'chat-end')}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <Image src={role === 'ai' ? '/logo-white-bg.png' : user?.image || '/avatar.png'} alt="avatar" />
        </div>
      </div>
      {isLoading ? (
        <div className="chat-bubble flex items-center bg-accent">
          <span className="loading loading-dots loading-md text-accent-content"></span>
        </div>
      ) : (
        <ReactMarkdown
          className={classNames(
            'react-markdown chat-bubble',
            role === 'ai' ? 'bg-accent text-accent-content' : 'bg-primary text-primary-content',
          )}
        >
          {message}
        </ReactMarkdown>
      )}
    </div>
  );
}
