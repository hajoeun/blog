import Image from 'next/image';

import { SocialCard } from '@/components/social-card';

export default function Page() {
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
          <p className="text-center text-gray-600 dark:text-gray-400">
            마플, 뱅크샐러드 거쳐 현재는 당근에서 프론트엔드 엔지니어로 일하고 있어요.
            <br />
            인프런에서 지식공유자로 활동하고 있어요.
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
              <button className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white">
                Subscribe 339
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-video rounded-lg bg-gray-100 dark:bg-gray-800" />
              ))}
            </div>
          </SocialCard>

          {/* Instagram Card */}
          <SocialCard className="bg-white dark:bg-[#2C2C2C]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image
                  src="/assets/instagram.png"
                  alt="Instagram"
                  width={32}
                  height={32}
                  className="rounded"
                />
                <span className="font-medium text-gray-900 dark:text-gray-100">@hajoeun_</span>
              </div>
              <button className="rounded-full bg-blue-500 px-4 py-1.5 text-sm font-medium text-white">
                Follow 1.5K
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-lg bg-gray-100 dark:bg-gray-800" />
              ))}
            </div>
          </SocialCard>

          {/* Threads Card */}
          <SocialCard className="bg-white dark:bg-[#2C2C2C]">
            <div className="flex items-center space-x-3">
              <Image
                src="/assets/threads.png"
                alt="Threads"
                width={32}
                height={32}
                className="rounded"
              />
              <span className="font-medium text-gray-900 dark:text-gray-100">Threads</span>
            </div>
          </SocialCard>

          {/* Threads Card */}
          <SocialCard className="bg-white dark:bg-[#2C2C2C]">
            <div className="flex items-center space-x-3">
              <Image
                src="/assets/linkedin.png"
                alt="LinkedIn"
                width={32}
                height={32}
                className="rounded"
              />
              <span className="font-medium text-gray-900 dark:text-gray-100">LinkedIn</span>
            </div>
          </SocialCard>
        </div>
      </div>
    </div>
  );
}
