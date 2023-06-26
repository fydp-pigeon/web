'use client';

import { useTypewriter } from '@/_hooks/useTypewriter';
import { useEffect } from 'react';

const SAMPLE_QUESTIONS = [
  "What is the average daily occupancy of Toronto's shelters?",
  "What is the average class size in Toronto's public schools?",
  'Which neighborhoods in Toronto have the highest crime rates?',
  'What is the percentage of green space in less advantaged parts the city?',
  'How does the crime rate in Toronto vary across different seasons?',
  'What percentage of households in Toronto experience food insecurity?',
];

export function ChatQuestions() {
  const { text: question, setContent: setQuestion } = useTypewriter();

  useEffect(() => {
    let i = 0;

    setQuestion(SAMPLE_QUESTIONS[i]);

    const intervalId = setInterval(() => setQuestion(SAMPLE_QUESTIONS[i++ % SAMPLE_QUESTIONS.length]), 4000);

    return () => clearInterval(intervalId);
  }, [setQuestion]);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="text-lg">Ask GPT anything about the city data.</div>
      <input type="text" className="input-bordered input w-full md:w-2/3" placeholder={question} />
      <div className="flex w-full justify-center p-2">
        <button className="btn-primary btn">Start a conversation</button>
      </div>
    </div>
  );
}
