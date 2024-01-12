import { Pinecone } from '@pinecone-database/pinecone';
import { createEmbedding } from './createEmbedding';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});

export const queryPinecone = async (input: string) => {
  const vector = await createEmbedding(input);

  return await pinecone.index('pigeon').query({
    topK: 1,
    vector,
    includeMetadata: true,
  });
};
