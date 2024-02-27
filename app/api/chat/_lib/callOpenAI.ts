import { ChatOpenAI } from '@langchain/openai';
import { ConversationChain } from 'langchain/chains';

export const callOpenAI = async (input: string) => {
  try {
    const chat = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-4',
      temperature: 0,
    });

    const chain = new ConversationChain({
      llm: chat,
    });

    const completion = await chain.call({
      input,
    });

    return completion.response as string;
  } catch (e) {
    throw Error('Error calling OpenAI: ' + e);
  }
};
