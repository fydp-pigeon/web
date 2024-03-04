'use client';

import { Card } from '@/_components/Card';
import { callBackend } from '@/_lib/client/callBackend';
import { truncateText } from '@/dashboard/_lib/truncateText';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconFilled } from '@heroicons/react/24/solid';
import { Dataset } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

type Props = {
  userBookmarks?: Dataset[];
  dataset: Dataset;
};

export function DatasetCard({ dataset, userBookmarks }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const bookmark = userBookmarks?.find(({ id }) => dataset.id === id);
  const isBookmarked = !!bookmark;
  const iconHeight = 22;

  const onBookmark = async () => {
    setIsLoading(true);

    try {
      if (isBookmarked) {
        await callBackend({ url: `/api/bookmark/${bookmark.id}`, method: 'DELETE' });
      } else {
        await callBackend({ url: `/api/bookmark/${dataset.id}`, method: 'POST', body: {} });
      }

      router.refresh();
    } catch (e) {
      console.error(e);
    }

    setIsLoading(false);
  };

  return (
    <Card
      key={dataset.id}
      title={dataset.title}
      actions={
        <div className="flex items-center gap-2">
          {!!userBookmarks && (
            <button className="btn btn-ghost" onClick={onBookmark} disabled={isLoading}>
              {isBookmarked ? <BookmarkIconFilled height={iconHeight} /> : <BookmarkIcon height={iconHeight} />}
            </button>
          )}
          <Link href={`/dashboard/datasets/${dataset.id}`} className="btn btn-primary">
            Explore
          </Link>
        </div>
      }
    >
      <ReactMarkdown>{truncateText({ text: dataset.description || '', numChars: 300 })}</ReactMarkdown>
    </Card>
  );
}
