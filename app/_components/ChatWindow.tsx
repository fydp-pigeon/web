import classNames from 'classnames';
import { ChatBubble } from './ChatBubble';

type Props = {
  messages: string[];
  className?: string;
  isLoadingResponse?: boolean;
};

export function ChatWindow({ messages, className, isLoadingResponse }: Props) {
  return (
    <div className={classNames('flex flex-col gap-2 overflow-y-auto p-5', className)}>
      {messages.length ? (
        messages.map((message, i) => <ChatBubble role={i % 2 === 1 ? 'ai' : 'user'} key={i} message={message} />)
      ) : (
        <div className="flex h-full w-full items-center justify-center text-5xl font-semibold text-gray-500 opacity-50">
          Pigeon
        </div>
      )}
      {isLoadingResponse && <ChatBubble role="ai" isLoading />}
    </div>
  );
}
