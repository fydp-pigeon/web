import { Card } from '@/_components/Card';
import prisma from '@/_lib/server/prismadb';
import ReactMarkdown from 'react-markdown';
import { truncateText } from '../_lib/truncateText';
import Link from 'next/link';
import { SearchField } from '../_components/SearchField';
import { PageHeader } from '../_components/PageHeader';

type Props = {
  searchParams: { searchText?: string };
};

export default async function DatasetsPage({ searchParams: { searchText } }: Props) {
  const datasets = await prisma.dataset.findMany({
    where: {
      ...(searchText && { title: { contains: searchText, mode: 'insensitive' } }),
      ...(searchText && { description: { contains: searchText, mode: 'insensitive' } }),
    },
  });

  return (
    <>
      <PageHeader title="Datasets" />
      <SearchField searchText={searchText} />
      {datasets.map(dataset => (
        <Card
          key={dataset.id}
          title={dataset.title}
          actions={
            <Link href={`/dashboard/datasets/${dataset.id}`} className="btn-primary btn">
              Explore
            </Link>
          }
        >
          <ReactMarkdown>{truncateText({ text: dataset.description || '', numChars: 300 })}</ReactMarkdown>
        </Card>
      ))}
    </>
  );
}
