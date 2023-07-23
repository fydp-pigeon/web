import { DatasetLink } from '@/_components/landing-page/browse-datasets/DatasetLink';

export default function Explore() {
  return (
    <div className="flex w-full flex-col items-center">
      <DatasetLink href="/">Top 5 Popular Datasets</DatasetLink>
      <div className="grid w-2/3 grid-cols-1 gap-6 md:grid-cols-2">
        <DatasetLink href="/"></DatasetLink>
        <DatasetLink href="/"></DatasetLink>
      </div>
    </div>
  );
}
