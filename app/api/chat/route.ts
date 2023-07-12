import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ChatHistoryLog, callOpenAI } from '@/api/chat/_lib/langchain';
import prisma from '@/_lib/server/prismadb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { generateApiResponse } from '../_lib/generateApiResponse';
import { logErrorMessage } from '../_lib/generateErrorMessage';

const bodySchema = z.object({
  input: z.string(),
  // Will attempt to load previous history if this is provided
  conversationId: z.string().optional(),
});

const postHandler = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { input, conversationId: existingConversationId } = bodySchema.parse(body);
    const session = await getServerSession(authOptions);

    let history;
    let newConversationId;

    if (existingConversationId) {
      history = await prisma.conversation.findUnique({
        where: {
          id: existingConversationId,
        },
        include: {
          responses: true,
        },
      });

      history = history?.responses;

      if (!history) {
        return NextResponse.json({}, { status: 404 });
      }
    } else {
      const newConversation = await prisma.conversation.create({
        data: {
          userId: session?.user?.id,
        },
      });

      newConversationId = newConversation.id;
    }

    const conversationId = (existingConversationId || newConversationId)!;

    const { response, confidenceScore, dataset } = await callOpenAI({
      input,
      history,
    });

    await prisma.response.create({
      data: {
        conversationId,
        question: input,
        response: response,
        confidenceScore,
        dataset,
      },
    });

    return generateApiResponse({ status: 200, data: { response, conversationId } });
  } catch (error) {
    const errorMessage = logErrorMessage({
      message: 'Calling chat api.',
      error,
    });

    return generateApiResponse({ status: 500, error: errorMessage });
  }
};

export { postHandler as POST };
