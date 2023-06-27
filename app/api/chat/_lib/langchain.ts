import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
  HumanMessagePromptTemplate,
} from 'langchain/prompts';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ConversationChain } from 'langchain/chains';
import { BufferMemory, ChatMessageHistory } from 'langchain/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { SYSTEM_PROMPT, HUMAN_PROMPT } from './prompts';
import { queryPinecone } from './pinecone';
import { Prisma } from '@prisma/client';

const chat = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-3.5-turbo',
});

// Conversational chain allows us to start a conversation with history
const chatPrompt = ChatPromptTemplate.fromPromptMessages([
  SystemMessagePromptTemplate.fromTemplate(SYSTEM_PROMPT),
  new MessagesPlaceholder('history'),
  HumanMessagePromptTemplate.fromTemplate(HUMAN_PROMPT),
]);

// const chatPrompt = new ChatPromptTemplate({
//   inputVariables: ['input', 'data', 'history'],
//   promptMessages: [
//     SystemMessagePromptTemplate.fromTemplate(SYSTEM_PROMPT),
//     new MessagesPlaceholder('history'),
//     HumanMessagePromptTemplate.fromTemplate(HUMAN_PROMPT),
//   ],
// });

const embedding = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'text-embedding-ada-002',
});

export const createEmbedding = (input: string) => {
  return embedding.embedQuery(input);
};

export type ChatHistoryLog = {
  id: string;
  conversationId: string;
  question: string;
  response: string;
  timestamp: Date;
  confidenceScore: Prisma.Decimal;
  dataset: string;
};

export const callOpenAI = async ({ input, history = [] }: { input: string; history?: ChatHistoryLog[] }) => {
  const chatHistory = new ChatMessageHistory();

  for (const { question, response } of history) {
    await chatHistory.addUserMessage(question);
    await chatHistory.addAIChatMessage(response);
  }

  const chain = new ConversationChain({
    memory: new BufferMemory({ returnMessages: true, chatHistory, memoryKey: 'history', inputKey: 'history' }),
    prompt: chatPrompt,
    llm: chat,
  });

  const data = await queryPinecone(input);

  const completion = await chain.call({
    input,
    data: JSON.stringify(data.matches[0].metadata),
  });

  return {
    response: completion.response as string,
    confidenceScore: data.matches[0].score,
    dataset: data.matches[0].id,
  };
};
