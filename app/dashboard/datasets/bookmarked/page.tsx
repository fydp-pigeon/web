import { PageHeader } from '@/dashboard/_components/PageHeader';
import { SearchField } from '@/dashboard/_components/SearchField';
import { Suspense } from 'react';
import { Spinner } from '@/_components/Spinner';
import DatasetsWrapper from './_lib/DatasetsWrapper';

type Props = {
  searchParams: { searchText?: string };
};

export default async function DatasetsPage({ searchParams: { searchText } }: Props) {
  return (
    <>
      <PageHeader title="Bookmarked Datasets" />
      <SearchField searchText={searchText} />
      <Suspense fallback={<Spinner />}>
        <DatasetsWrapper searchParams={{ searchText }} />
      </Suspense>
    </>
  );
}
