import Image from 'next/image';

import { SocialCard } from '@/components/social-card';
import {
  getYouTubeSubscriberCount,
  getYouTubeVideos,
  YouTubeChannelId,
} from '@/utils/get-youtube-data';

export default async function Page() {
  const youTubeSubscriberCount = await getYouTubeSubscriberCount();
  const youTubeVideos = await getYouTubeVideos();

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#1C1C1C]">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-32 w-32 overflow-hidden rounded-full bg-gray-100">
            <Image
              src="/assets/thumbnail.png"
              alt="Profile"
              width={128}
              height={128}
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">하조은</h1>
          <p className=" text-gray-600 dark:text-gray-400">
            ⚬ 개발자의 성장을 돕는 컨텐츠를 만들어요 <br />⚬ 마플, 뱅크샐러드 출신 | 당근 프론트엔드
            개발자
          </p>
        </div>

        {/* Social Links Section */}
        <div className="mt-8 space-y-4">
          {/* YouTube Card */}
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
              <a
                href={`https://www.youtube.com/channel/${YouTubeChannelId}?sub_confirmation=1`}
                target="_blank"
                className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white flex justify-center"
              >
                Subscribe {youTubeSubscriberCount}
              </a>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {youTubeVideos.map((v, i) => (
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
          </SocialCard>

          {/* Threads Card */}
          <SocialCard className="bg-white dark:bg-[#2C2C2C]">
            <a
              href="https://www.threads.net/@hajoeun_"
              target="_blank"
              className="flex items-center space-x-3"
            >
              <Image
                src="/assets/threads.png"
                alt="Threads"
                width={32}
                height={32}
                className="rounded"
              />
              <span className="font-medium text-gray-900 dark:text-gray-100">Threads</span>
            </a>
          </SocialCard>

          {/* Threads Card */}
          <SocialCard className="bg-white dark:bg-[#2C2C2C]">
            <a
              href="https://www.linkedin.com/in/hajoeun/"
              target="_blank"
              className="flex items-center space-x-3"
            >
              <Image
                src="/assets/linkedin.png"
                alt="LinkedIn"
                width={32}
                height={32}
                className="rounded"
              />
              <span className="font-medium text-gray-900 dark:text-gray-100">LinkedIn</span>
            </a>
          </SocialCard>

          {/* Instagram Card */}
          <SocialCard className="bg-white dark:bg-[#2C2C2C]">
            <a
              href="https://www.instagram.com/hajoeun_"
              target="_blank"
              className="flex items-center space-x-3"
            >
              <Image
                src="/assets/instagram.png"
                alt="Instagram"
                width={32}
                height={32}
                className="rounded"
              />
              <span className="font-medium text-gray-900 dark:text-gray-100">Threads</span>
            </a>
          </SocialCard>
        </div>
      </div>
    </div>
  );
}
