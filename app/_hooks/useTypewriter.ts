"use client";

import { useEffect, useState } from "react";

type Props = {
  intervalMs?: number;
  initialText?: string;
};

export const useTypewriter = ({
  intervalMs = 20,
  initialText = "",
}: Props = {}) => {
  const [text, setText] = useState<string>("");
  const [content, setContent] = useState<string>(initialText);
  const [_, setIntervalId] = useState<NodeJS.Timer>();

  useEffect(() => {
    // (async () => {
    //   setText("");

    //   for (const char of content) {
    //     await new Promise((resolve) => setTimeout(resolve, intervalMs));

    //     setText((prev) => prev + char);
    //   }
    // })();

    if (content) {
      setText("");
      let i = 0;
      setIntervalId((prevIntervalId) => {
        if (prevIntervalId) {
          clearInterval(prevIntervalId);
        }

        const newIntervalId = setInterval(() => {
          if (i >= content.length - 1) {
            clearInterval(newIntervalId);
          }

          setText((prevContent) => prevContent + content[i++]);
        }, intervalMs);

        return newIntervalId;
      });
    }
  }, [content, intervalMs]);

  return { text, setContent };
};
