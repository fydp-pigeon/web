import { Card } from '@/_components/Card';
import prisma from '@/_lib/server/prismadb';
import ReactMarkdown from 'react-markdown';
import { truncateText } from '../_lib/truncateText';
import Link from 'next/link';
import { SearchField } from '../_components/SearchField';
import { PageHeader } from '../_components/PageHeader';
import { getServerUser } from '@/_lib/server/getServerUser';
import { InlineLink } from '@/_components/inputs/InlineLink';
import { PlusIcon } from '@heroicons/react/24/outline';

type Props = {
  searchParams: { searchText?: string };
};

export default async function ConversationsPage({ searchParams: { searchText } }: Props) {
  const user = await getServerUser();
  const conversations = await prisma.conversation.findMany({
    where: {
      userId: user.id,
      ...(searchText && { title: { contains: searchText, mode: 'insensitive' } }),
    },
    orderBy: [{ date: 'desc' }],
    include: {
      responses: {
        select: {
          response: true,
        },
        orderBy: [{ timestamp: 'desc' }],
        take: 1,
      },
    },
  });

  return (
    <>
      <PageHeader
        title="Conversations"
        rightContent={
          <Link href="/dashboard/chat/new" className="btn-primary btn">
            <PlusIcon height={22} /> New chat
          </Link>
        }
      />
      <SearchField searchText={searchText} />
      {conversations.length ? (
        conversations.map(conversation => (
          <Card
            key={conversation.id}
            title={conversation.title}
            actions={
              <Link href={`/dashboard/chat/${conversation.id}`} className="btn-primary btn">
                Open
              </Link>
            }
          >
            <span className="font-semibold">Latest response: </span>
            <ReactMarkdown>
              {truncateText({ text: conversation.responses[0]?.response || '', numChars: 300 })}
            </ReactMarkdown>
          </Card>
        ))
      ) : (
        <div>
          No data. <InlineLink href="/dashboard/chat/new">Start a new conversation.</InlineLink>{' '}
        </div>
      )}
    </>
  );
}
