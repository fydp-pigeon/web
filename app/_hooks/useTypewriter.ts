'use client';

import { useEffect, useState } from 'react';

type Props = {
  intervalMs?: number;
  initialText?: string;
};

export const useTypewriter = ({ intervalMs = 40, initialText = '' }: Props = {}) => {
  const [text, setText] = useState<string>('');
  const [content, setContent] = useState<string>();
  const [_, setIntervalId] = useState<NodeJS.Timer>();

  useEffect(() => {
    if (initialText) {
      setContent(initialText);
    }
  }, [initialText]);

  useEffect(() => {
    if (content) {
      setText('');

      let i = 0;
      setIntervalId(prevIntervalId => {
        if (prevIntervalId) {
          clearInterval(prevIntervalId);
        }

        const newIntervalId = setInterval(() => {
          if (i >= content.length) {
            clearInterval(newIntervalId);
            return;
          }

          const j = i;
          setText(prevContent => prevContent + content[j]);

          i += 1;
        }, intervalMs);

        return newIntervalId;
      });
    }
  }, [content, intervalMs]);

  return { text, setContent };
};
