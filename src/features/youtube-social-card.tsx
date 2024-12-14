import Image from 'next/image';
import { PropsWithChildren, Suspense, use } from 'react';

import { SocialCard } from '@/components/social-card';
import {
  getYouTubeSubscriberCount,
  getYouTubeVideos,
  YouTubeChannelId,
} from '@/utils/get-youtube-data';

export const YouTubeSocialCard = () => {
  return (
    <SocialCard className="bg-white dark:bg-[#2C2C2C]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image
            src="/assets/youtube.png"
            alt="YouTube"
            width={32}
            height={32}
            className="rounded"
          />
          <span className="font-medium text-gray-900 dark:text-gray-100">하조은조하</span>
        </div>
        <Suspense fallback={<SubscribeButtonCore>Subscribe</SubscribeButtonCore>}>
          <SubscribeButton />
        </Suspense>
      </div>
      <Suspense>
        <VideoThumbnailList />
      </Suspense>
    </SocialCard>
  );
};

const SubscribeButton = () => {
  const subscriberCount = use(getYouTubeSubscriberCount());

  return <SubscribeButtonCore>Subscribe {subscriberCount}</SubscribeButtonCore>;
};

const SubscribeButtonCore = ({ children }: PropsWithChildren) => {
  return (
    <a
      href={`https://www.youtube.com/channel/${YouTubeChannelId}?sub_confirmation=1`}
      target="_blank"
      className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white flex justify-center"
    >
      {children}
    </a>
  );
};

const VideoThumbnailList = () => {
  const videos = use(getYouTubeVideos());

  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      {videos.map((v, i) => (
        <a
          key={i}
          href={`https://www.youtube.com/watch?v=${v.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="aspect-video rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden"
        >
          <Image
            src={v.thumbnail}
            alt={v.title}
            width={320}
            height={180}
            className="object-cover w-full h-full rounded-lg"
          />
        </a>
      ))}
    </div>
  );
};
