import Image from 'next/image';

import { SocialCard } from '@/components/social-card';
import { YouTubeSocialCard } from '@/components/youtube-social-card';

export default async function Page() {
  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#1C1C1C]">
      <div className="mx-auto max-w-2xl py-8">
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
          <YouTubeSocialCard />

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
