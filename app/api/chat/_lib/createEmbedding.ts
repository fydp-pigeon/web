import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

const embedding = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'text-embedding-ada-002',
});

export const createEmbedding = (input: string) => {
  return embedding.embedQuery(input);
};
