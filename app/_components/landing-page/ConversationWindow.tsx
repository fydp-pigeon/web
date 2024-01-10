'use client';

import { useTypewriter } from '@/_hooks/useTypewriter';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import PaperAirplaneIcon from '@heroicons/react/24/outline/PaperAirplaneIcon';
import { useToast } from '@/_hooks/useToast';
import { ChatWindow } from '../ChatWindow';

const SAMPLE_QUESTIONS = [
  "What is the average daily occupancy of Toronto's shelters?",
  "What is the average class size in Toronto's public schools?",
  'Which neighborhoods in Toronto have the highest crime rates?',
  'What is the percentage of green space in less advantaged parts the city?',
  'How does the crime rate in Toronto vary across different seasons?',
  'What percentage of households in Toronto experience food insecurity?',
];

export function ConversationWindow() {
  const showToast = useToast();
  const { text: question, setContent: setQuestion } = useTypewriter();
  const [showChatWindow, setShowChatWindow] = useState<boolean>();
  const [messages, setMessages] = useState<string[]>([]);
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
        setMessages(prevMessages => [...prevMessages, message]);
        setIsLoadingResponse(true);
        if (!showChatWindow) {
          setShowChatWindow(true);
        }

        const response = await fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({
            input: message,
            conversationId,
          }),
        });

        const respBody = await response.json();

        setIsLoadingResponse(false);
        setConversationId(respBody.conversationId);
        setMessages(prevMessages => [...prevMessages, respBody.response]);
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
