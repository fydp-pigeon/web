'use client';

import classNames from 'classnames';
import { Image } from '@/_components/Image';
import { useClientUser } from '@/_lib/client/hooks/useClientUser';
import ReactMarkdown from 'react-markdown';
import { ReactNode } from 'react';

export type ChatMessage = {
  role: 'ai' | 'user';
  content: string;
  imageUrl?: string | null;
};

type Props = { message: ChatMessage; isLoading?: false } | { message?: ChatMessage; isLoading: true };

export function ChatBubble({ message, isLoading }: Props) {
  const { user } = useClientUser({ allowUnauthenticated: true });

  return (
    <div className={classNames('chat', message?.role === 'user' ? 'chat-end' : 'chat-start')}>
      <div className="avatar chat-image">
        <div className="w-10 rounded-full">
          <Image src={message?.role === 'user' ? user?.image || '/avatar.png' : '/logo-white-bg.png'} alt="avatar" />
        </div>
      </div>
      {isLoading ? (
        <div className="chat-bubble flex items-center bg-accent">
          <span className="loading loading-dots loading-md text-accent-content"></span>
        </div>
      ) : (
        <>
          <div
            className={classNames(
              'chat-bubble space-y-4',
              message.role === 'ai' ? 'bg-accent text-accent-content' : 'bg-primary text-primary-content',
            )}
          >
            <ReactMarkdown className={'react-markdown'}>{message.content}</ReactMarkdown>
            {message.imageUrl && (
              <img src={message.imageUrl} className="w-full rounded-lg" alt="diagram from response" />
            )}
          </div>
        </>
      )}
    </div>
  );
}
