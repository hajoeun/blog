import Image from 'next/image';

import { InflearnSocialCard } from '@/features/inflearn-social-card';
import {
  CareerlySocialCard,
  InstagramSocialCard,
  LinkedInSocialCard,
  ThreadSocialCard,
} from '@/features/social-card-with-followers';
import { YouTubeSocialCard } from '@/features/youtube-social-card';

export default async function Page() {
  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#1C1C1C]">
      <div className="mx-auto max-w-2xl py-8">
        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gray-100">
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
          <YouTubeSocialCard />

          <ThreadSocialCard />

          <LinkedInSocialCard />

          <CareerlySocialCard />

          <InstagramSocialCard />
        </div>

        <div className="mt-12 space-y-4">
          <h3 className="ml-4 text-xl font-bold text-gray-900 dark:text-gray-100">강의</h3>
          <InflearnSocialCard title="Next.js 블로그 만들기" url="https://inf.run/Z8PRA" />
          <InflearnSocialCard title="Next.js 공식문서 훑어보기" url="https://inf.run/kzcU" />
          <InflearnSocialCard title="Next.js 마이그레이션하기" url="https://inf.run/heKES" />
        </div>
      </div>
    </div>
  );
}
