import type { Post } from '@/utils/get-posts';
import { parseDate } from '@/utils/parse-date';

import { YouTubePlayer } from './youtube-player';

type Props = { post: Post };

export function PostHeader({ post }: Props) {
  const displayDate = parseDate(post.date)
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replaceAll(' ', '');

  return (
    <>
      <h1 className="text-2xl font-bold mb-1 dark:text-gray-100">{post.title}</h1>

      <p className="font-mono flex text-xs text-gray-500 dark:text-gray-500">
        <span className="flex-grow">
          {/* since we will pre-render the relative time, over time it
           * will diverge with what the user relative time is, so we suppress the warning.
           * In practice this is not an issue because we revalidate the entire page over time
           * and because we will move this to a server component with template.tsx at some point */}
          <span suppressHydrationWarning={true}>{displayDate}</span>
        </span>
      </p>

      {post.videoId && (
        <div className="my-4">
          <YouTubePlayer videoId={post.videoId} />
        </div>
      )}
    </>
  );
}
