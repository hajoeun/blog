'use client';

import YouTube from 'react-youtube';

type YouTubePlayerProps = {
  videoId: string;
};

export function YouTubePlayer({ videoId }: YouTubePlayerProps) {
  return <YouTube videoId={videoId} className="w-full" />;
}
