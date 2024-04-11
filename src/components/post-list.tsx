'use client';

import Link from 'next/link';
import { Suspense, useMemo, useState } from 'react';

import type { Post } from '@/utils/get-posts';
import { getYear } from '@/utils/get-year';
import { parseDate } from '@/utils/parse-date';

type SortSetting = ['date', 'desc' | 'asc'];

type Props = {
  posts: Post[];
};

export function PostList({ posts }: Props) {
  const [sort, setSort] = useState<SortSetting>(['date', 'desc']);
  const sortDate = () => {
    setSort((sort) => ['date', sort[0] !== 'date' || sort[1] === 'asc' ? 'desc' : 'asc']);
  };

  return (
    <Suspense fallback={null}>
      <main className="max-w-2xl font-mono m-auto mb-10 text-sm">
        <header className="text-gray-500 dark:text-gray-600 flex items-center text-xs">
          <button
            onClick={sortDate}
            className={`w-12 h-9 text-left  ${
              sort[0] === 'date' && sort[1] !== 'desc' ? 'text-gray-700 dark:text-gray-400' : ''
            }`}
          >
            date
            {sort[0] === 'date' && sort[1] === 'asc' && '↑'}
          </button>
          <span className="grow pl-2">title</span>
        </header>

        <List posts={posts} sort={sort} />
      </main>
    </Suspense>
  );
}

type ListProps = {
  posts: Post[];
  sort: SortSetting;
};

function List({ posts, sort }: ListProps) {
  // sort can be ["date", "desc"] for example
  const sortedPosts = useMemo(() => {
    const [_, sortDirection] = sort;
    return [...posts].sort((a, b) => {
      return sortDirection === 'desc'
        ? parseDate(b.date).getTime() - parseDate(a.date).getTime()
        : parseDate(a.date).getTime() - parseDate(b.date).getTime();
    });
  }, [posts, sort]);

  return (
    <ul>
      {sortedPosts.map((post, i: number) => {
        const year = getYear(post.date);
        const firstOfYear = !sortedPosts[i - 1] || getYear(sortedPosts[i - 1].date) !== year;
        const lastOfYear = !sortedPosts[i + 1] || getYear(sortedPosts[i + 1].date) !== year;

        return (
          <li key={post.slug}>
            <Link href={post.slug}>
              <span
                className={`flex transition-[background-color] hover:bg-gray-100 dark:hover:bg-[#242424] active:bg-gray-200 dark:active:bg-[#222] border-y border-gray-200 dark:border-[#313131]
                ${!firstOfYear ? 'border-t-0' : ''}
                ${lastOfYear ? 'border-b-0' : ''}
              `}
              >
                <span className={`py-3 flex grow items-center ${!firstOfYear ? 'ml-14' : ''}`}>
                  {firstOfYear && (
                    <span className="w-14 inline-block self-start shrink-0 text-gray-500 dark:text-gray-500">
                      {year}
                    </span>
                  )}

                  <span className="grow dark:text-gray-100">{post.title}</span>
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
