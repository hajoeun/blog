'use client';

import { usePathname } from 'next/navigation';

export function Logo() {
  const pathname = usePathname();
  const title = pathname === '/about' ? 'hajoeun.com/about' : 'hajoeun.com/posts';

  return (
    <span className="text-md md:text-lg whitespace-nowrap font-bold">
      <span className="cursor-default pr-2">{title}</span>
    </span>
  );
}
