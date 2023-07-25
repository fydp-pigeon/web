'use client';

import { Input } from '@/_components/inputs/Input';
import { useDebounce } from '@/_lib/client/useDebounce';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = {
  searchText?: string;
};

export function SearchField({ searchText: prevSearchText }: Props) {
  const [searchText, setSearchText] = useState<string>(prevSearchText || '');
  const debouncedSearchText = useDebounce(searchText, 300);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (debouncedSearchText) {
      router.push(`${pathname}?searchText=${debouncedSearchText}`, { scroll: false });
    } else {
      router.replace(pathname, { scroll: false });
    }
  }, [debouncedSearchText, pathname, router]);

  return <Input placeholder="Search" value={searchText} onChange={setSearchText} />;
}
