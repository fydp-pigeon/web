import prisma from '@/_lib/server/prismadb';
import { getServerUser } from '@/_lib/server/getServerUser';
import { PageHeader } from '@/dashboard/_components/PageHeader';
import { SearchField } from '@/dashboard/_components/SearchField';
import { DatasetCard } from '../_components/DatasetCard';

type Props = {
  searchParams: { searchText?: string };
};

export default async function DatasetsPage({ searchParams: { searchText } }: Props) {
  const user = await getServerUser();

  const datasets = (
    await prisma.dataset.findMany({
      where: {
        ...(searchText && { title: { contains: searchText, mode: 'insensitive' } }),
        ...(searchText && { description: { contains: searchText, mode: 'insensitive' } }),
      },
      include: {
        users: true,
      },
    })
  ).filter(dataset => !!dataset.users.find(({ id }) => id === user.id));

  return (
    <>
      <PageHeader title="Bookmarked Datasets" />
      <SearchField searchText={searchText} />
      {datasets.map(dataset => (
        <DatasetCard key={dataset.id} dataset={dataset} />
      ))}
    </>
  );
}
