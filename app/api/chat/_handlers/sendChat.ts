import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/_lib/server/prismadb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/api/auth/[...nextauth]/_lib/authOptions';
import { generateApiResponse } from '@/api/_lib/generateApiResponse';
import { queryPinecone } from '../_lib/queryPinecone';
import { callOpenAIWithData } from '../_lib/callOpenAIWithData';
import { callOpenAI } from '../_lib/callOpenAI';
import { getFilteredDataFromGpt } from '../_lib/getFilteredDataFromGpt';
import { SEARCH_QUERY_PROMPT } from '../_lib/prompts';
import { logErrorMessage } from '@/api/_lib/generateErrorMessage';

const bodySchema = z.object({
  input: z.string(),
  // Will attempt to load conversation history if this is provided
  conversationId: z.string().optional(),
});

export type ApiSendChatBody = z.infer<typeof bodySchema>;

export type ApiSendChatResponse = {
  response: string;
  conversationTitle: string;
  conversationId: string;
  imageUrl?: string;
};

export const sendChat = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { input, conversationId: existingConversationId } = bodySchema.parse(body);
    const session = await getServerSession(authOptions);

    let history;
    let conversation;

    if (existingConversationId) {
      conversation = await prisma.conversation.findUnique({
        where: {
          id: existingConversationId,
        },
        include: {
          responses: true,
        },
      });

      if (!conversation) {
        return generateApiResponse({
          status: 404,
          error: `Could not find conversation with id: ${existingConversationId}`,
        });
      }

      history = conversation?.responses;

      if (!history) {
        return NextResponse.json({}, { status: 404 });
      }
    } else {
      const title = (
        await callOpenAI(
          `Generate a short, 3-5 word title based on this input: "${input}". Respond with a short, serious label. Be concise.`,
        )
      ).replaceAll('"', '');

      conversation = await prisma.conversation.create({
        data: {
          userId: session?.user?.id,
          title,
        },
      });
    }

    const searchQuery = await callOpenAI(SEARCH_QUERY_PROMPT(JSON.stringify(history), input));

    console.info('Search query:', searchQuery);

    // Query Pinecone
    const pineconeRes = await queryPinecone(searchQuery);
    const confidenceScore = pineconeRes.matches[0].score;
    const datasetId = pineconeRes.matches[0].id;

    const metadata = JSON.stringify(pineconeRes.matches[0].metadata);
    const data = JSON.stringify(
      (await getFilteredDataFromGpt({ datasetId, userQuery: input }))?.slice(0, 20) ?? [],
    ).substring(0, 30000);

    // Query OpenAI with data from Pinecone
    const { response, imageUrl } = await callOpenAIWithData({
      input,
      history,
      metadata,
      data,
    });

    await prisma.response.create({
      data: {
        conversationId: conversation.id,
        question: input,
        response: response,
        confidenceScore: confidenceScore ? confidenceScore * 100 : null,
        dataset: datasetId,
        imageUrl,
      },
    });

    return generateApiResponse<ApiSendChatResponse>({
      status: 200,
      data: { response, imageUrl, conversationId: conversation.id, conversationTitle: conversation.title },
    });
  } catch (error) {
    const errorMessage = logErrorMessage({
      message: 'Calling chat api',
      error,
    });

    return generateApiResponse({ status: 500, error: errorMessage });
  }
};
