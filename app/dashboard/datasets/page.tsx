import prisma from '@/_lib/server/prismadb';
import { SearchField } from '../_components/SearchField';
import { PageHeader } from '../_components/PageHeader';
import { getServerUser } from '@/_lib/server/getServerUser';
import { DatasetCard } from './_components/DatasetCard';

type Props = {
  searchParams: { searchText?: string };
};

export default async function DatasetsPage({ searchParams: { searchText } }: Props) {
  const user = await getServerUser();

  const userBookmarks = (
    await prisma.user.findUniqueOrThrow({
      where: {
        id: user.id,
      },
      include: {
        bookmarks: true,
      },
    })
  ).bookmarks;

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
        <DatasetCard key={dataset.id} userBookmarks={userBookmarks} dataset={dataset} />
      ))}
    </>
  );
}
