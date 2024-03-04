import { Card } from '@/_components/Card';
import { formatDate } from '@/_lib/client/formatDate';
import prisma from '@/_lib/server/prismadb';
import { PageHeader } from '@/dashboard/_components/PageHeader';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

type Props = {
  params: { datasetId: string };
};

export default async function Dataset({ params: { datasetId } }: Props) {
  const dataset = await prisma.dataset.findUnique({
    where: {
      id: datasetId,
    },
  });

  if (!dataset) return null;

  return (
    <>
      <PageHeader title={dataset.title} subtext={`Last updated: ${formatDate(dataset.lastUpdated)}`} />
      <Card title="Data">
        <Link href={dataset.url} className="btn btn-neutral">
          <ArrowDownTrayIcon height={22} /> Download
        </Link>
      </Card>
      <Card title="Description">
        <ReactMarkdown>{dataset.description || ''}</ReactMarkdown>
      </Card>
    </>
  );
}
