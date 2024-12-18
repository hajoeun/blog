'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function HeaderLink() {
  const pathname = usePathname();
  const isAboutPage = pathname === '/about';

  return (
    <Link
      href={isAboutPage ? '/' : '/about'}
      className="inline-flex hover:bg-gray-200 dark:hover:bg-[#313131] active:bg-gray-300 dark:active:bg-[#242424] rounded-sm p-2 transition-[background-color]"
    >
      {isAboutPage ? 'Posts' : 'About'}
    </Link>
  );
}
