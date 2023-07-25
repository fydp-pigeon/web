import { truncateText } from '@/dashboard/_lib/truncateText';
import { DatasetLink } from './DatasetLink';
import prisma from '@/_lib/server/prismadb';

export async function BrowseDatasets() {
  const datasets = await prisma.dataset.findMany({
    take: 6,
  });

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-5 text-xl">Browse datasets</div>
      <div className="grid w-2/3 grid-cols-1 gap-6 md:grid-cols-2">
        {datasets.map(({ id, title }) => (
          <DatasetLink key={id} href={`/dashboard/datasets/${id}`}>
            {truncateText({ text: title, numChars: 30 })}
          </DatasetLink>
        ))}
      </div>
    </div>
  );
}
