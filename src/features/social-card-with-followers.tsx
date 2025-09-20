import { sql } from '@vercel/postgres';
import Image from 'next/image';
import { Suspense, use } from 'react';

import { SocialCard } from '@/components/social-card';

const FollowerCount = ({ platform }: { platform: 'linkedin' | 'threads' | 'careerly' }) => {
  const {
    rows: [socialStats],
  } = use(sql`
    select followers
    from social_stats
    where platform = ${platform}
    order by timestamp desc
    limit 1
  `);

  const followerCount = new Intl.NumberFormat('en-US', { notation: 'compact' }).format(
    socialStats.followers
  );

  return <span className="text-xs">{followerCount} followers</span>;
};

export const ThreadSocialCard = () => {
  return (
    <SocialCard>
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
          className="rounded-lg"
        />
        <div className="flex justify-between items-center w-[100%] text-gray-900 dark:text-gray-100">
          <span className="font-medium text-sm">Threads</span>
          <Suspense>
            <FollowerCount platform="threads" />
          </Suspense>
        </div>
      </a>
    </SocialCard>
  );
};

export const LinkedInSocialCard = () => {
  return (
    <SocialCard>
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
          className="rounded-lg"
        />
        <div className="flex justify-between items-center w-[100%] text-gray-900 dark:text-gray-100">
          <span className="font-medium text-sm">LinkedIn</span>
          <Suspense>
            <FollowerCount platform="linkedin" />
          </Suspense>
        </div>
      </a>
    </SocialCard>
  );
};

export const CareerlySocialCard = () => {
  return (
    <SocialCard>
      <a
        href="https://careerly.co.kr/@hajoeun"
        target="_blank"
        className="flex items-center space-x-3"
      >
        <Image
          src="/assets/careerly.png"
          alt="Careerly"
          width={32}
          height={32}
          className="rounded-lg"
        />
        <div className="flex justify-between items-center w-[100%] text-gray-900 dark:text-gray-100">
          <span className="font-medium text-sm">Careerly</span>
          <Suspense>
            <FollowerCount platform="careerly" />
          </Suspense>
        </div>
      </a>
    </SocialCard>
  );
};

export const InstagramSocialCard = () => {
  return (
    <SocialCard>
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
          className="rounded-lg"
        />
        <div className="flex justify-between items-center w-[100%] text-gray-900 dark:text-gray-100">
          <span className="font-medium text-sm">Instagram</span>
          <span className="text-xs">1.5K followers</span>
        </div>
      </a>
    </SocialCard>
  );
};
