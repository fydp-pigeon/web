import { DatasetLink } from './DatasetLink';

export function BrowseDatasets() {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-5 text-xl">Browse datasets</div>
      <div className="grid w-2/3 grid-cols-1 gap-6 md:grid-cols-2">
        <DatasetLink href="/">Affordable housing</DatasetLink>
        <DatasetLink href="/">Affordable housing</DatasetLink>
        <DatasetLink href="/">Affordable housing</DatasetLink>
        <DatasetLink href="/">Affordable housing</DatasetLink>
        <DatasetLink href="/">Affordable housing</DatasetLink>
        <DatasetLink href="/">Affordable housing</DatasetLink>
      </div>
    </div>
  );
}
