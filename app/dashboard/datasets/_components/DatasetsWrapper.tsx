import prisma from '@/_lib/server/prismadb';
import { getServerUser } from '@/_lib/server/getServerUser';
import { DatasetCard } from './DatasetCard';

type Props = {
  searchParams: { searchText?: string };
};

export async function DatasetsWrapper({ searchParams: { searchText } }: Props) {
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

  return datasets.map(dataset => <DatasetCard key={dataset.id} userBookmarks={userBookmarks} dataset={dataset} />);
}
