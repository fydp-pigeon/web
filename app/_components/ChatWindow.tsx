import classNames from 'classnames';
import { ChatBubble, ChatMessage } from './ChatBubble';

type Props = {
  messages: ChatMessage[];
  className?: string;
  isLoadingResponse?: boolean;
};

export function ChatWindow({ messages, className, isLoadingResponse }: Props) {
  return (
    <div className={classNames('flex flex-col gap-2 overflow-y-auto p-5', className)}>
      {messages.length ? (
        messages.map((message, i) => <ChatBubble key={i} message={message} />)
      ) : (
        <div className="flex h-full w-full items-center justify-center text-5xl font-semibold text-gray-500 opacity-50">
          Pigeon
        </div>
      )}
      {isLoadingResponse && <ChatBubble isLoading />}
    </div>
  );
}
