'use client';

import { useTypewriter } from '@/_hooks/useTypewriter';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import PaperAirplaneIcon from '@heroicons/react/24/outline/PaperAirplaneIcon';
import { useToast } from '@/_hooks/useToast';
import { ChatWindow } from '../ChatWindow';
import { ChatMessage } from '../ChatBubble';
import { callBackend } from '@/_lib/client/callBackend';
import { ApiSendChatBody, ApiSendChatResponse } from '@/api/chat/_handlers/sendChat';

const SAMPLE_QUESTIONS = [
  'What are the different factors in cost of living for different income households?',
  'What 10 areas of the city has the highest criminal activity?',
  "Can you tell me about the city's affordable housing access for youth wellbeing in little italy?",
  'Give me the top 5 licensed childcare centres with the most amount of total space.',
  'What are some of the tallest buildings in the city?',
  'How many households in Toronto experience food insecurity?',
];

export function ConversationWindow() {
  const showToast = useToast();
  const { text: question, setContent: setQuestion } = useTypewriter();
  const [showChatWindow, setShowChatWindow] = useState<boolean>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [conversationId, setConversationId] = useState<string>();
  const [isLoadingResponse, setIsLoadingResponse] = useState<boolean>(false);

  useEffect(() => {
    let i = 0;

    setQuestion(SAMPLE_QUESTIONS[i]);

    const intervalId = setInterval(() => setQuestion(SAMPLE_QUESTIONS[i++ % SAMPLE_QUESTIONS.length]), 4000);

    return () => clearInterval(intervalId);
  }, [setQuestion]);

  const onSendMessage = async (message: string) => {
    if (message) {
      try {
        setCurrentMessage('');
        setMessages(prevMessages => [...prevMessages, { role: 'user', content: message }]);
        setIsLoadingResponse(true);
        if (!showChatWindow) {
          setShowChatWindow(true);
        }

        const chatRes = await callBackend<ApiSendChatResponse, ApiSendChatBody>({
          url: '/api/chat',
          method: 'POST',
          body: {
            input: message,
            conversationId,
          },
        });

        setIsLoadingResponse(false);
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

  const onToggleConversation = () => {
    if (!showChatWindow) {
      onSendMessage(currentMessage || SAMPLE_QUESTIONS.find(q => q.includes(question))!);
    }
    setShowChatWindow(!showChatWindow);
  };

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="text-lg">Ask GPT anything about the city data.</div>

      {/* Chat window */}
      <ChatWindow
        messages={messages}
        className={classNames(showChatWindow ? 'h-96 w-4/5' : 'h-0 w-0 px-0 py-0 opacity-0', 'transition-all')}
        isLoadingResponse={isLoadingResponse}
      />

      {/* Input field */}
      <div className="mt-2 flex w-full items-center justify-center gap-2">
        <input
          type="text"
          className="input input-bordered w-full md:w-2/3"
          value={currentMessage}
          placeholder={showChatWindow ? 'Send a message' : question}
          onChange={e => setCurrentMessage(e.target.value)}
          onKeyDown={onKeyPress}
          disabled={isLoadingResponse}
        />
        {showChatWindow && (
          <button className="btn btn-ghost px-3" onClick={() => onSendMessage(currentMessage)}>
            <PaperAirplaneIcon width={24} />
          </button>
        )}
      </div>

      {/* Toggle conversation start/end */}
      <div className="flex w-full justify-center p-2">
        <button className="btn btn-primary" onClick={onToggleConversation}>
          {showChatWindow ? 'End' : 'Start a'} conversation
        </button>
      </div>
    </div>
  );
}
