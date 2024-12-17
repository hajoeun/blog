import Image from 'next/image';

import { SocialCard } from '@/components/social-card';

type Props = {
  title: string;
  url: string;
};

export const InflearnSocialCard = ({ title, url }: Props) => {
  return (
    <SocialCard className="bg-white dark:bg-[#2C2C2C]">
      <div className="flex items-center justify-between">
        <a href={url} target="_blank" className="flex items-center space-x-3">
          <Image
            src="/assets/inflearn.png"
            alt="Inflearn"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{title}</span>
        </a>
      </div>
    </SocialCard>
  );
};
