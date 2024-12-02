'use client';

import { YouTubeChannelId } from '@/utils/get-youtube-data';

type Props = {
  youTubeSubscriberCount: number;
};

export const YouTubeSubscribeButton = ({ youTubeSubscriberCount }: Props) => {
  return (
    <button
      className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white flex justify-center"
      onClick={() =>
        window.open(
          `https://www.youtube.com/channel/${YouTubeChannelId}?sub_confirmation=1`,
          '_blank'
        )
      }
    >
      Subscribe {youTubeSubscriberCount}
    </button>
  );
};
