import { Conversation } from './_components/Conversation';
import prisma from '@/_lib/server/prismadb';

type Props = {
  params: { conversationId: string };
};

export default async function NewConversationPage({ params: { conversationId } }: Props) {
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      responses: true,
    },
  });

  return <Conversation conversation={conversation} />;
}
