'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/_hooks/useToast';
import { callBackend } from '@/_lib/client/callBackend';
import { ApiSendChatBody, ApiSendChatResponse } from '@/api/chat/_handlers/sendChat';
import { useTypewriter } from '@/_hooks/useTypewriter';
import { Conversation, Response } from '@prisma/client';
import { ChatWindow } from '@/_components/ChatWindow';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/_components/inputs/BackButton';
import { ChatMessage } from '@/_components/ChatBubble';

type Props = {
  conversation: (Conversation & { responses: Response[] }) | null;
};

export function ChatWrapper({ conversation }: Props) {
  const showToast = useToast();
  const router = useRouter();
  const { text: title, setContent: setTitle } = useTypewriter({ initialText: conversation?.title });
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [conversationId, setConversationId] = useState<string>(conversation?.id || '');
  const [isLoadingResponse, setIsLoadingResponse] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>(
    conversation?.responses?.flatMap(({ question, response, imageUrl }) => [
      { role: 'user', content: question },
      { role: 'ai', content: response, imageUrl },
    ]) || [],
  );

  const onSendMessage = async (message: string) => {
    if (message) {
      try {
        setCurrentMessage('');
        setMessages(prevMessages => [...prevMessages, { role: 'user', content: message }]);
        setIsLoadingResponse(true);

        const chatRes = await callBackend<ApiSendChatResponse, ApiSendChatBody>({
          url: '/api/chat',
          method: 'POST',
          body: {
            input: message,
            conversationId,
          },
        });

        if (!conversationId) {
          router.replace(`/dashboard/chat/${chatRes.conversationId}`, { scroll: false });
        }

        setIsLoadingResponse(false);
        setTitle(chatRes.conversationTitle);
        setConversationId(chatRes.conversationId);
        setMessages(prevMessages => [
          ...prevMessages,
          { role: 'ai', content: chatRes.response, imageUrl: chatRes.imageUrl },
        ]);
      } catch (e) {
        console.error(e);
        showToast({
          type: 'success',
          text: 'There was an error! 🎉',
        });
      }
    }
  };

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSendMessage(currentMessage);
    }
  };

  return (
    <div className="relative flex w-full flex-col items-center gap-3">
      <BackButton href="/dashboard/chat" className="absolute left-0 top-4" />
      <div className="text-3xl">{title || 'New chat'}</div>
      <div className="text-md">Ask GPT anything about the city data.</div>

      {/* Chat window */}
      <ChatWindow
        messages={messages}
        className="h-[70vh] w-full rounded-lg border-[1px] border-base-200"
        isLoadingResponse={isLoadingResponse}
      />

      {/* Input field */}
      <div className="mt-2 flex w-full items-center justify-center gap-2">
        <input
          type="text"
          className="input input-bordered w-full"
          value={currentMessage}
          placeholder="Send a message"
          onChange={e => setCurrentMessage(e.target.value)}
          onKeyDown={onKeyPress}
          disabled={isLoadingResponse}
        />

        <button className="btn btn-ghost px-3" onClick={() => onSendMessage(currentMessage)}>
          <PaperAirplaneIcon width={24} />
        </button>
      </div>
    </div>
  );
}
