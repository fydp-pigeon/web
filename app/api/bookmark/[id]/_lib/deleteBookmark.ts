import { getServerSession } from 'next-auth';
import prisma from '@/_lib/server/prismadb';
import { generateApiResponse } from '@/api/_lib/generateApiResponse';
import { logErrorMessage } from '@/api/_lib/generateErrorMessage';
import { authOptions } from '@/api/auth/[...nextauth]/_lib/authOptions';
import { NextRequest } from 'next/server';

type Request = {
  params: { id: string };
};

export const deleteBookmark = async (_: NextRequest, request: Request) => {
  const { id } = request.params;

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return generateApiResponse({
        status: 402,
        error: 'Unauthenticated.',
      });
    }

    const dataset = await prisma.dataset.findUnique({
      where: {
        id,
      },
    });

    if (!dataset) {
      return generateApiResponse({
        status: 404,
        error: 'Dataset not found.',
      });
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        bookmarks: {
          disconnect: {
            id,
          },
        },
      },
    });

    return generateApiResponse({
      status: 200,
      data: {},
    });
  } catch (error) {
    const errorMessage = logErrorMessage({
      message: 'Error signing in.',
      error,
    });

    return generateApiResponse({ status: 500, error: errorMessage });
  }
};
