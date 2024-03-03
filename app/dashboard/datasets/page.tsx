import { SearchField } from '../_components/SearchField';
import { PageHeader } from '../_components/PageHeader';
import { Suspense } from 'react';
import { Spinner } from '@/_components/Spinner';
import { DatasetsWrapper } from './_components/DatasetsWrapper';

type Props = {
  searchParams: { searchText?: string };
};

export default async function DatasetsPage({ searchParams }: Props) {
  return (
    <>
      <PageHeader title="Datasets" />
      <SearchField searchText={searchParams.searchText} />
      <Suspense fallback={<Spinner />}>
        <DatasetsWrapper searchParams={searchParams} />
      </Suspense>
    </>
  );
}
