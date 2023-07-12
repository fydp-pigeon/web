import { PineconeClient } from 'pinecone-client';
import { createEmbedding } from '@/api/chat/_lib/langchain';

const pinecone = new PineconeClient({
  apiKey: process.env.PINECONE_API_KEY,
  baseUrl: process.env.PINECONE_BASE_URL,
});

export const queryPinecone = async (input: string) => {
  const vector = await createEmbedding(input);

  return await pinecone.query({ topK: 1, vector, includeMetadata: true });
};
