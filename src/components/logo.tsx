'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Logo() {
  const pathname = usePathname();

  const isAboutPage = pathname === '/about';
  const title = isAboutPage ? 'hajoeun.com/about' : 'hajoeun.com/posts';

  return (
    <Link
      href={isAboutPage ? '/about' : '/'}
      className="text-md md:text-lg whitespace-nowrap font-bold"
    >
      <span className="cursor-default pr-2">{title}</span>
    </Link>
  );
}
