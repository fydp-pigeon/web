import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
  HumanMessagePromptTemplate,
} from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { ConversationChain } from 'langchain/chains';
import { BufferMemory, ChatMessageHistory } from 'langchain/memory';
import { SYSTEM_PROMPT, HUMAN_PROMPT } from './prompts';
import { Response } from '@prisma/client';

export const callOpenAIWithData = async ({
  input,
  metadata,
  data,
  history = [],
}: {
  input: string;
  metadata: string;
  data: string;
  history?: Response[];
}) => {
  try {
    const chatHistory = new ChatMessageHistory();

    for (const { question, response } of history) {
      await chatHistory.addUserMessage(question);
      await chatHistory.addAIMessage(response);
    }

    const chat = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-4-turbo-preview',
    });

    // Conversational chain allows us to start a conversation with history
    const chatPrompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(SYSTEM_PROMPT),
      new MessagesPlaceholder('history'),
      HumanMessagePromptTemplate.fromTemplate(HUMAN_PROMPT),
    ]);

    const chain = new ConversationChain({
      memory: new BufferMemory({ returnMessages: true, chatHistory, inputKey: 'input' }),
      prompt: chatPrompt,
      llm: chat,
    });

    const completion = await chain.call({
      input,
      _metadata: metadata,
      data: data,
    });

    let response = completion.response as string;

    if (response[0] === '"') {
      response = response.substring(1);
    }

    if (response[response.length - 1]) {
      response = response.substring(0, response.length - 1);
    }

    return {
      response: completion.response as string,
    };
  } catch (e) {
    throw Error('Error calling OpenAI: ' + e);
  }
};
